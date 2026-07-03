// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { Tooltip } from "../tooltip/tooltip";

function makeTrigger(rect: Partial<DOMRect>): HTMLElement {
  const el = document.createElement("span");
  el.getBoundingClientRect = () => ({
    top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => "",
    ...rect,
  });
  return el;
}

describe("Tooltip", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts hidden", () => {
    const tooltip = new Tooltip();
    expect(tooltip.isOpen).toBe(false);
  });

  it("show() opens after openDelay", () => {
    const tooltip = new Tooltip({ openDelay: 300 });
    tooltip.show();
    expect(tooltip.isOpen).toBe(false);
    vi.advanceTimersByTime(300);
    expect(tooltip.isOpen).toBe(true);
  });

  it("hide() closes after closeDelay", () => {
    const tooltip = new Tooltip({ openDelay: 0, closeDelay: 200 });
    tooltip.show();
    vi.advanceTimersByTime(0);
    expect(tooltip.isOpen).toBe(true);

    tooltip.hide();
    expect(tooltip.isOpen).toBe(true);
    vi.advanceTimersByTime(200);
    expect(tooltip.isOpen).toBe(false);
  });

  it("hide() before openDelay cancels the open", () => {
    const tooltip = new Tooltip({ openDelay: 500 });
    tooltip.show();
    tooltip.hide();
    vi.advanceTimersByTime(600);
    expect(tooltip.isOpen).toBe(false);
  });

  it("contentId is a stable string", () => {
    const tooltip = new Tooltip();
    expect(typeof tooltip.contentId).toBe("string");
    expect(tooltip.contentId).toBe(tooltip.contentId);
  });

  it("computes a position relative to the registered trigger when shown", () => {
    const tooltip = new Tooltip({ openDelay: 0 });
    tooltip._registerTrigger(makeTrigger({ top: 100, left: 50, right: 150, bottom: 120, width: 100 }));
    tooltip.show();
    vi.advanceTimersByTime(0);
    expect(tooltip._position).toEqual({ top: 96, left: 100, transform: "translate(-50%, -100%)" });
  });

  it("respects side/align/sideOffset props when computing position", () => {
    const tooltip = new Tooltip({ openDelay: 0, side: "right", align: "start", sideOffset: 8 });
    tooltip._registerTrigger(makeTrigger({ top: 100, left: 50, right: 150, bottom: 120, width: 100 }));
    tooltip.show();
    vi.advanceTimersByTime(0);
    expect(tooltip._position).toEqual({ top: 100, left: 158, transform: "translate(0, 0)" });
  });
});
