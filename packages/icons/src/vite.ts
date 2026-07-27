import type { Plugin } from "vite";

// Matches @RegisterIconProvider('name', './path/*.svg') — 2nd arg is a quoted glob path.
// Same technique as @praxisjs/content's contentPlugin: a source-text rewrite that runs
// before Vite's own import.meta.glob transform, not an AST-based one.
const REGISTER_ICON_PROVIDER_RE = /@RegisterIconProvider\(\s*(['"`])(.*?)\1\s*,\s*(['"`])(.*?)\3\s*\)/g;

/**
 * Rewrites `@RegisterIconProvider('name', './path/*.svg')` into
 * `@RegisterIconProvider('name', import.meta.glob('./path/*.svg', { eager: true,
 * query: '?raw', import: 'default' }))` at build time, so a glob path can be
 * passed to the decorator directly instead of writing `import.meta.glob`
 * yourself. Calls with a non-string second argument (an object literal, a
 * variable, `iconsFromGlob(...)`, ...) are left untouched.
 */
export function iconsPlugin(): Plugin {
  return {
    name: "morphos-icons",
    enforce: "pre",
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
