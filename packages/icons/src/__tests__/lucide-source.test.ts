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
