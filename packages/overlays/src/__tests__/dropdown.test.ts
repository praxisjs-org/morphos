// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";

import { Dropdown } from "../dropdown/dropdown";

function makeTrigger(rect: Partial<DOMRect>): HTMLElement {
  const el = document.createElement("button");
  el.getBoundingClientRect = () => ({
    top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => "",
    ...rect,
  });
  return el;
}

describe("Dropdown", () => {
  it("starts closed", () => {
    const dd = new Dropdown();
    dd.onBeforeMount?.();
    expect(dd.isOpen).toBe(false);
  });

  it("openDropdown() opens the dropdown", () => {
    const dd = new Dropdown();
    dd.onBeforeMount?.();
    dd.openDropdown();
    expect(dd.isOpen).toBe(true);
  });

  it("closeDropdown() closes the dropdown", () => {
    const dd = new Dropdown({ defaultOpen: true });
    dd.onBeforeMount?.();
    dd.closeDropdown();
    expect(dd.isOpen).toBe(false);
  });

  it("toggle() inverts state", () => {
    const dd = new Dropdown();
    dd.onBeforeMount?.();
    dd.toggle();
    expect(dd.isOpen).toBe(true);
    dd.toggle();
    expect(dd.isOpen).toBe(false);
  });

  it("calls onOpenChange on open and close", () => {
    const onOpenChange = vi.fn();
    const dd = new Dropdown({ onOpenChange });
    dd.openDropdown();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    dd.closeDropdown();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("has no position before a trigger is registered", () => {
    const dd = new Dropdown();
    dd.onBeforeMount?.();
    dd.openDropdown();
    expect(dd._position).toBeNull();
  });

  it("computes a position relative to the registered trigger on open", () => {
    const dd = new Dropdown();
    dd.onBeforeMount?.();
    dd._registerTrigger(makeTrigger({ top: 100, left: 50, right: 150, bottom: 120 }));
    dd.openDropdown();
    expect(dd._position).toEqual({ top: 124, left: 50, transform: "translate(0, 0)" });
  });

  it("respects side/align/sideOffset props when computing position", () => {
    const dd = new Dropdown({ side: "top", align: "end", sideOffset: 10 });
    dd.onBeforeMount?.();
    dd._registerTrigger(makeTrigger({ top: 100, left: 50, right: 150, bottom: 120 }));
    dd.openDropdown();
    expect(dd._position).toEqual({ top: 90, left: 150, transform: "translate(-100%, -100%)" });
  });
});
