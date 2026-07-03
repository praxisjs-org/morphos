import { describe, it, expect, beforeEach } from "vitest";

import { generateId } from "../id";

describe("generateId", () => {
  it("returns a string", () => {
    expect(typeof generateId()).toBe("string");
  });

  it("uses the default prefix", () => {
    expect(generateId()).toMatch(/^morphos-/);
  });

  it("uses a custom prefix", () => {
    expect(generateId("dialog")).toMatch(/^dialog-/);
  });

  it("returns unique IDs on each call", () => {
    const a = generateId();
    const b = generateId();
    expect(a).not.toBe(b);
  });
});
