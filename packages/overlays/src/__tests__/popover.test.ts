// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";

import { Popover } from "../popover/popover";

function makeTrigger(rect: Partial<DOMRect>): HTMLElement {
  const el = document.createElement("button");
  el.getBoundingClientRect = () => ({
    top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => "",
    ...rect,
  });
  return el;
}

describe("Popover", () => {
  it("starts closed", () => {
    const popover = new Popover();
    popover.onBeforeMount?.();
    expect(popover.isOpen).toBe(false);
  });

  it("toggle() opens and closes the popover", () => {
    const popover = new Popover();
    popover.onBeforeMount?.();
    popover.toggle();
    expect(popover.isOpen).toBe(true);
    popover.toggle();
    expect(popover.isOpen).toBe(false);
  });

  it("closePopover() closes the popover", () => {
    const popover = new Popover({ defaultOpen: true });
    popover.onBeforeMount?.();
    popover.closePopover();
    expect(popover.isOpen).toBe(false);
  });

  it("calls onOpenChange on toggle and close", () => {
    const onOpenChange = vi.fn();
    const popover = new Popover({ onOpenChange });
    popover.onBeforeMount?.();
    popover.toggle();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    popover.closePopover();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("has no position before a trigger is registered", () => {
    const popover = new Popover();
    popover.onBeforeMount?.();
    popover.toggle();
    expect(popover._position).toBeNull();
  });

  it("computes a position relative to the registered trigger on open", () => {
    const popover = new Popover();
    popover.onBeforeMount?.();
    popover._registerTrigger(makeTrigger({ top: 100, left: 50, right: 150, bottom: 120 }));
    popover.toggle();
    expect(popover._position).toEqual({ top: 124, left: 50, transform: "translate(0, 0)" });
  });

  it("respects side/align/sideOffset props when computing position", () => {
    const popover = new Popover({ side: "top", align: "center", sideOffset: 8 });
    popover.onBeforeMount?.();
    popover._registerTrigger(makeTrigger({ top: 100, left: 50, right: 150, bottom: 120, width: 100 }));
    popover.toggle();
    expect(popover._position).toEqual({ top: 92, left: 100, transform: "translate(-50%, -100%)" });
  });
});
