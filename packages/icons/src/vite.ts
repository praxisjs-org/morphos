import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import type { Plugin } from "vite";

// Everything lives in this one file on purpose: `vite.config.ts` loads `@morphos/icons/vite`
// straight through Node's ESM loader, which can't resolve the extensionless relative imports
// `tsc` emits for the rest of the package.

const SCANNED_EXTENSIONS = /\.(?:[cm]?[jt]sx?|mdx?)$/;
const SKIPPED_DIRS = new Set(["node_modules", "dist", "__tests__", ".git"]);
const STRING_LITERAL_RE = /(['"`])([A-Z][A-Za-z0-9]*)\1/g;

function* walk(dir: string): Generator<string> {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!SKIPPED_DIRS.has(entry.name)) yield* walk(join(dir, entry.name));
    } else if (SCANNED_EXTENSIONS.test(entry.name)) {
      yield join(dir, entry.name);
    }
  }
}

/**
 * Collects every quoted PascalCase literal under `dirs` that is a real lucide icon name.
 * Matching on any string literal (not just `<Icon name="...">`) also catches names kept in
 * maps, arrays, and props like `icon: "Plus"`. A false positive only costs one extra icon.
 */
export function collectIconNames(dirs: string[], known: ReadonlySet<string>): Set<string> {
  const used = new Set<string>();
  for (const dir of dirs) {
    for (const file of walk(dir)) {
      for (const match of readFileSync(file, "utf8").matchAll(STRING_LITERAL_RE)) {
        if (known.has(match[2])) used.add(match[2]);
      }
    }
  }
  return used;
}

/** Source of a module with the same `icons` export as `lucide`, limited to `names`. */
export function buildSubsetModule(icons: Record<string, unknown>, names: Iterable<string>): string {
  const subset: Record<string, unknown> = {};
  for (const name of [...names].sort()) {
    if (Object.hasOwn(icons, name)) subset[name] = icons[name];
  }
  return `export const icons = ${JSON.stringify(subset)};\n`;
}

// Matches @RegisterIconProvider('name', './path/*.svg') — 2nd arg is a quoted glob path.
// Same technique as @praxisjs/content's contentPlugin: a source-text rewrite that runs
// before Vite's own import.meta.glob transform, not an AST-based one.
const REGISTER_ICON_PROVIDER_RE = /@RegisterIconProvider\(\s*(['"`])(.*?)\1\s*,\s*(['"`])(.*?)\3\s*\)/g;

// The one file in this package that imports the full icon set from `lucide`.
const LUCIDE_DATA_RE = /[\\/]icons[\\/](?:dist|src)[\\/]data[\\/]lucide\.[jt]s$/;
const SUBSET_ID = "\0morphos-icons:lucide-subset";

export interface IconsPluginOptions {
  /**
   * Production builds ship only the lucide icons the app references, instead of all ~2,100.
   * Set to `false` to always bundle the full set.
   */
  lucide?:
    | false
    | {
        /** Icon names to always keep — for names built at runtime that a source scan can't see. */
        include?: string[];
        /** Directories to scan for icon names, relative to the project root. Defaults to `["src"]`. */
        scan?: string[];
      };
}

/**
 * Rewrites `@RegisterIconProvider('name', './path/*.svg')` into
 * `@RegisterIconProvider('name', import.meta.glob('./path/*.svg', { eager: true,
 * query: '?raw', import: 'default' }))` at build time, so a glob path can be
 * passed to the decorator directly instead of writing `import.meta.glob`
 * yourself. Calls with a non-string second argument (an object literal, a
 * variable, `iconsFromGlob(...)`, ...) are left untouched.
 *
 * It also trims the built-in `"lucide"` set in production builds: the app's source is scanned
 * for lucide icon names, and `@morphos/icons` is served a module containing only those.
 */
export function iconsPlugin(options: IconsPluginOptions = {}): Plugin {
  const lucide = options.lucide === false ? undefined : (options.lucide ?? {});
  let subset: string | undefined;

  return {
    name: "morphos-icons",
    enforce: "pre",
    async buildStart() {
      subset = undefined;
      if (!lucide || this.environment.config.command !== "build") return;

      let icons: Record<string, unknown>;
      try {
        ({ icons } = (await import("lucide")) as { icons: Record<string, unknown> });
      } catch {
        return; // lucide isn't installed (it's an optional peer) — the app doesn't use it, nothing to trim
      }
      const root = this.environment.config.root;
      const dirs = (lucide.scan ?? ["src"]).map((dir) => resolve(root, dir));
      const used = collectIconNames(dirs, new Set(Object.keys(icons)));
      for (const name of lucide.include ?? []) used.add(name);
      subset = buildSubsetModule(icons, used);
    },
    resolveId(source: string, importer?: string) {
      if (subset !== undefined && source === "lucide" && importer && LUCIDE_DATA_RE.test(importer)) {
        return SUBSET_ID;
      }
    },
    load(id: string) {
      if (id === SUBSET_ID) return subset;
    },
    transform(code: string, id: string) {
      if (!id.endsWith(".ts") && !id.endsWith(".tsx")) return;
      if (!REGISTER_ICON_PROVIDER_RE.test(code)) return;
      REGISTER_ICON_PROVIDER_RE.lastIndex = 0; // reset after .test()

      const transformed = code.replace(
        REGISTER_ICON_PROVIDER_RE,
        (_match, _q1: string, provider: string, _q3: string, glob: string) =>
          `@RegisterIconProvider(${JSON.stringify(provider)}, import.meta.glob(${JSON.stringify(glob)}, { eager: true, query: "?raw", import: "default" }))`,
      );

      return { code: transformed, map: null };
    },
  };
}
