import { describe, it, expect, vi } from "vitest";

import { Accordion } from "../accordion/accordion";

describe("Accordion (single)", () => {
  it("starts with no item open", () => {
    const a = new Accordion({ type: "single" });
    a.onBeforeMount?.();
    expect(a.isOpen("item-1")).toBe(false);
  });

  it("toggle() opens an item", () => {
    const a = new Accordion({ type: "single" });
    a.onBeforeMount?.();
    a.toggle("item-1");
    expect(a.isOpen("item-1")).toBe(true);
  });

  it("toggle() closes an open item when collapsible", () => {
    const a = new Accordion({ type: "single", collapsible: true });
    a.onBeforeMount?.();
    a.toggle("item-1");
    a.toggle("item-1");
    expect(a.isOpen("item-1")).toBe(false);
  });

  it("toggle() does not close when not collapsible", () => {
    const a = new Accordion({ type: "single", collapsible: false });
    a.onBeforeMount?.();
    a.toggle("item-1");
    a.toggle("item-1");
    expect(a.isOpen("item-1")).toBe(true);
  });

  it("opening a different item closes the previous one", () => {
    const a = new Accordion({ type: "single" });
    a.onBeforeMount?.();
    a.toggle("item-1");
    a.toggle("item-2");
    expect(a.isOpen("item-1")).toBe(false);
    expect(a.isOpen("item-2")).toBe(true);
  });

  it("calls onValueChange on toggle", () => {
    const onValueChange = vi.fn();
    const a = new Accordion({ type: "single", onValueChange });
    a.toggle("item-1");
    expect(onValueChange).toHaveBeenCalledWith("item-1");
  });
});

describe("Accordion (multiple)", () => {
  it("allows multiple items open at once", () => {
    const a = new Accordion({ type: "multiple" });
    a.onBeforeMount?.();
    a.toggle("item-1");
    a.toggle("item-2");
    expect(a.isOpen("item-1")).toBe(true);
    expect(a.isOpen("item-2")).toBe(true);
  });

  it("toggle() on an open item removes it from the set", () => {
    const a = new Accordion({ type: "multiple" });
    a.onBeforeMount?.();
    a.toggle("item-1");
    a.toggle("item-2");
    a.toggle("item-1");
    expect(a.isOpen("item-1")).toBe(false);
    expect(a.isOpen("item-2")).toBe(true);
  });
});
