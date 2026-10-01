import { describe, expect, it } from "vitest";

import { LucideSource } from "../data/lucide-source";
import { IconSource } from "../provider/icon-source";
import { getIconResolver } from "../provider/registry";

describe("LucideSource", () => {
  it("is a real IconSource subclass, not special-cased elsewhere", () => {
    expect(new LucideSource()).toBeInstanceOf(IconSource);
  });

  it("is registered as \"lucide\" just by being imported, via its own @RegisterIconProvider", () => {
    expect(getIconResolver("lucide")).toBeDefined();
  });

  it("resolves a known name to structured node data", () => {
    const data = new LucideSource().resolve("Plus");
    expect(data && "nodes" in data ? data.nodes.length : 0).toBeGreaterThan(0);
    expect(data && "nodes" in data ? data.viewBox : undefined).toBe("0 0 24 24");
  });

  it("returns undefined for an unknown name", () => {
    expect(new LucideSource().resolve("NotARealIconName123")).toBeUndefined();
  });
});

describe("@morphos/icons/lucide entry", () => {
  it("exports LucideSource, so the main entry doesn't have to import lucide", async () => {
    const entry = await import("../lucide");
    expect(entry.LucideSource).toBe(LucideSource);
  });

  it("is not re-exported from the main entry", async () => {
    const main = await import("../index");
    expect("LucideSource" in main).toBe(false);
  });
});
