import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Plugin } from "vite";

import { buildSubsetModule, collectIconNames, iconsPlugin, type IconsPluginOptions } from "../vite";

const KNOWN = new Set(["Plus", "Search", "House", "X"]);
let root: string;

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "morphos-icons-"));
  mkdirSync(join(root, "src", "__tests__"), { recursive: true });
  mkdirSync(join(root, "src", "node_modules", "pkg"), { recursive: true });
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

describe("collectIconNames", () => {
  it("finds known names in any quoted literal, in any quote style", () => {
    writeFileSync(
      join(root, "src", "app.tsx"),
      `<Icon name="Plus" /> const a = 'Search'; const b = \`House\`; const c = { icon: "X" }`,
    );
    expect(collectIconNames([join(root, "src")], KNOWN)).toEqual(new Set(["Plus", "Search", "House", "X"]));
  });

  it("ignores unknown names, unquoted words and non-source files", () => {
    writeFileSync(join(root, "src", "app.ts"), `const a = "Banana"; const Plus = 1;`);
    writeFileSync(join(root, "src", "notes.txt"), `"Plus"`);
    expect(collectIconNames([join(root, "src")], KNOWN).size).toBe(0);
  });

  it("skips __tests__ and node_modules", () => {
    writeFileSync(join(root, "src", "__tests__", "a.test.ts"), `"Plus"`);
    writeFileSync(join(root, "src", "node_modules", "pkg", "index.js"), `"Search"`);
    expect(collectIconNames([join(root, "src")], KNOWN).size).toBe(0);
  });

  it("returns nothing for a missing directory", () => {
    expect(collectIconNames([join(root, "nope")], KNOWN).size).toBe(0);
  });
});

describe("buildSubsetModule", () => {
  it("emits an `icons` export with only the requested names", () => {
    const icons = { Plus: [["path", { d: "M1" }]], Search: [["circle", { r: 1 }]] };
    const code = buildSubsetModule(icons, ["Plus", "Missing"]);
    expect(code).toBe(`export const icons = ${JSON.stringify({ Plus: icons.Plus })};\n`);
  });
});

type Hooks = Plugin & {
  buildStart: (this: unknown) => Promise<void>;
  resolveId: (source: string, importer?: string) => string | undefined;
  load: (id: string) => string | undefined;
};

function setup(command: "build" | "serve", options?: IconsPluginOptions) {
  const plugin = iconsPlugin(options) as Hooks;
  const ctx = { environment: { config: { command, root } } };
  return { plugin, start: () => plugin.buildStart.call(ctx) };
}

const LUCIDE_DATA = "/app/node_modules/@morphos/icons/dist/data/lucide.js";

describe("iconsPlugin lucide subset", () => {
  it("serves a subset of the icons the app references on build", async () => {
    writeFileSync(join(root, "src", "app.tsx"), `<Icon name="Plus" />`);
    const { plugin, start } = setup("build");
    await start();

    const id = plugin.resolveId("lucide", LUCIDE_DATA);
    expect(id).toBeDefined();
    const code = plugin.load(id as string) ?? "";
    expect(code).toContain('"Plus"');
    expect(code).not.toContain('"Search"');
  });

  it("keeps names passed through `include`", async () => {
    const { plugin, start } = setup("build", { lucide: { include: ["Search"] } });
    await start();
    const code = plugin.load(plugin.resolveId("lucide", LUCIDE_DATA) as string) ?? "";
    expect(code).toContain('"Search"');
  });

  it("scans custom directories", async () => {
    mkdirSync(join(root, "lib"));
    writeFileSync(join(root, "lib", "x.ts"), `"Plus"`);
    const { plugin, start } = setup("build", { lucide: { scan: ["lib"] } });
    await start();
    const code = plugin.load(plugin.resolveId("lucide", LUCIDE_DATA) as string) ?? "";
    expect(code).toContain('"Plus"');
  });

  it("only intercepts the import made by this package's own lucide data file", async () => {
    const { plugin, start } = setup("build");
    await start();
    expect(plugin.resolveId("lucide", "/app/src/main.ts")).toBeUndefined();
    expect(plugin.resolveId("other", LUCIDE_DATA)).toBeUndefined();
  });

  it("leaves lucide untouched during dev", async () => {
    const { plugin, start } = setup("serve");
    await start();
    expect(plugin.resolveId("lucide", LUCIDE_DATA)).toBeUndefined();
  });

  it("leaves lucide untouched when disabled", async () => {
    const { plugin, start } = setup("build", { lucide: false });
    await start();
    expect(plugin.resolveId("lucide", LUCIDE_DATA)).toBeUndefined();
  });

  it("does nothing, without failing the build, when lucide isn't installed", async () => {
    vi.resetModules();
    vi.doMock("lucide", () => {
      throw new Error("Cannot find package 'lucide'");
    });
    try {
      const { iconsPlugin: freshPlugin } = await import("../vite");
      const plugin = freshPlugin() as Hooks;
      await plugin.buildStart.call({ environment: { config: { command: "build", root } } });
      expect(plugin.resolveId("lucide", LUCIDE_DATA)).toBeUndefined();
    } finally {
      vi.doUnmock("lucide");
    }
  });
});
