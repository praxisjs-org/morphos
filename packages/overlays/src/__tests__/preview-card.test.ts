// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { PreviewCard } from "../preview-card/preview-card";

function makeTrigger(rect: Partial<DOMRect>): HTMLElement {
  const el = document.createElement("span");
  el.getBoundingClientRect = () => ({
    top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => "",
    ...rect,
  });
  return el;
}

describe("PreviewCard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts closed", () => {
    const card = new PreviewCard();
    card.onBeforeMount?.();
    expect(card.isOpen).toBe(false);
  });

  it("openWithDelay() opens after openDelay", () => {
    const card = new PreviewCard({ openDelay: 300 });
    card.onBeforeMount?.();
    card.openWithDelay();
    expect(card.isOpen).toBe(false);
    vi.advanceTimersByTime(300);
    expect(card.isOpen).toBe(true);
  });

  it("closeWithDelay() closes after closeDelay", () => {
    const card = new PreviewCard({ openDelay: 0, closeDelay: 100 });
    card.onBeforeMount?.();
    card.openWithDelay();
    vi.advanceTimersByTime(0);
    expect(card.isOpen).toBe(true);

    card.closeWithDelay();
    expect(card.isOpen).toBe(true);
    vi.advanceTimersByTime(100);
    expect(card.isOpen).toBe(false);
  });

  it("computes a position relative to the registered trigger on open", () => {
    const card = new PreviewCard({ openDelay: 0 });
    card.onBeforeMount?.();
    card._registerTrigger(makeTrigger({ top: 100, left: 50, right: 150, bottom: 120 }));
    card.openWithDelay();
    vi.advanceTimersByTime(0);
    expect(card._position).toEqual({ top: 124, left: 50, transform: "translate(0, 0)" });
  });

  it("respects side/align/sideOffset props when computing position", () => {
    const card = new PreviewCard({ openDelay: 0, side: "bottom", align: "end", sideOffset: 6 });
    card.onBeforeMount?.();
    card._registerTrigger(makeTrigger({ top: 100, left: 50, right: 150, bottom: 120 }));
    card.openWithDelay();
    vi.advanceTimersByTime(0);
    expect(card._position).toEqual({ top: 126, left: 150, transform: "translate(-100%, 0)" });
  });
});
