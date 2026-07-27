import { describe, expect, it } from "vitest";
import type { Plugin } from "vite";

import { iconsPlugin } from "../vite";

function transform(code: string, id = "brand-icons.ts"): string | undefined {
  const plugin = iconsPlugin() as Plugin & {
    transform: (code: string, id: string) => { code: string } | undefined;
  };
  const result = plugin.transform(code, id);
  return result?.code;
}

describe("iconsPlugin transform", () => {
  it("rewrites RegisterIconProvider with single-quoted args", () => {
    const out = transform("@RegisterIconProvider('brand', './icons/brand/*.svg')");
    expect(out).toContain("import.meta.glob");
    expect(out).toContain("./icons/brand/*.svg");
    expect(out).toContain('"brand"');
    expect(out).toContain('query: "?raw"');
    expect(out).toContain('import: "default"');
    expect(out).toContain("eager: true");
    expect(out).not.toContain("@RegisterIconProvider('brand', './icons/brand/*.svg')");
  });

  it("rewrites RegisterIconProvider with double-quoted args", () => {
    const out = transform('@RegisterIconProvider("brand", "./icons/brand/*.svg")');
    expect(out).toContain("import.meta.glob");
    expect(out).toContain("./icons/brand/*.svg");
  });

  it("rewrites RegisterIconProvider with backtick args", () => {
    const out = transform("@RegisterIconProvider(`brand`, `./icons/brand/*.svg`)");
    expect(out).toContain("import.meta.glob");
    expect(out).toContain("./icons/brand/*.svg");
  });

  it("does not transform a non-string second argument", () => {
    const out = transform("@RegisterIconProvider('brand', brandIcons)");
    expect(out).toBeUndefined();
  });

  it("does not transform an object-literal second argument", () => {
    const out = transform("@RegisterIconProvider('brand', { Logo: svg })");
    expect(out).toBeUndefined();
  });

  it("does not transform files without the decorator", () => {
    const out = transform("const x = 1;", "file.ts");
    expect(out).toBeUndefined();
  });

  it("skips non-ts files", () => {
    const out = transform("@RegisterIconProvider('brand', './icons/brand/*.svg')", "file.js");
    expect(out).toBeUndefined();
  });

  it("handles a nested glob pattern", () => {
    const out = transform("@RegisterIconProvider('brand', './icons/**/*.svg')");
    expect(out).toContain("import.meta.glob");
    expect(out).toContain("./icons/**/*.svg");
  });

  it("rewrites every matching decorator when there's more than one", () => {
    const out = transform(
      "@RegisterIconProvider('brand', './icons/brand/*.svg')\nclass A {}\n" +
        "@RegisterIconProvider('marketing', './icons/marketing/*.svg')\nclass B {}",
    );
    expect(out).toContain("./icons/brand/*.svg");
    expect(out).toContain("./icons/marketing/*.svg");
    expect(out?.match(/import\.meta\.glob/g)).toHaveLength(2);
  });
});
