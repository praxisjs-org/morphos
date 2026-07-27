import { describe, expect, it } from "vitest";

import { iconsFromGlob } from "../provider/icons-from-glob";

describe("iconsFromGlob", () => {
  it("keys each icon by its file basename, without extension", () => {
    const icons = iconsFromGlob({
      "/src/icons/brand/logo.svg": '<path d="M1"/>',
      "/src/icons/brand/mark.svg": '<path d="M2"/>',
    });
    expect(icons).toEqual({
      logo: '<path d="M1"/>',
      mark: '<path d="M2"/>',
    });
  });

  it("passes already-clean names (no slash) through unchanged", () => {
    const icons = iconsFromGlob({ Logo: '<path d="M1"/>', Mark: '<path d="M2"/>' });
    expect(icons).toEqual({ Logo: '<path d="M1"/>', Mark: '<path d="M2"/>' });
  });

  it("returns an empty object for an empty glob result", () => {
    expect(iconsFromGlob({})).toEqual({});
  });

  it("ignores a path with no discernible basename", () => {
    expect(iconsFromGlob({ "": '<path d="M1"/>' })).toEqual({});
  });
});
