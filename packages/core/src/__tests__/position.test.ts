// @vitest-environment jsdom
import { describe, it, expect } from "vitest";

import { computeAnchorPosition } from "../position";

function makeAnchor(rect: Partial<DOMRect>): Element {
  const el = document.createElement("div");
  el.getBoundingClientRect = () => ({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON: () => "",
    ...rect,
  });
  return el;
}

describe("computeAnchorPosition", () => {
  it("defaults to bottom/start placement", () => {
    const anchor = makeAnchor({ top: 100, left: 50, right: 150, bottom: 120, width: 100, height: 20 });
    const pos = computeAnchorPosition(anchor);
    expect(pos.top).toBe(124); // bottom + default offset (4)
    expect(pos.left).toBe(50);
    expect(pos.transform).toBe("translate(0, 0)");
  });

  it("places above the anchor for side='top'", () => {
    const anchor = makeAnchor({ top: 100, left: 50, right: 150, bottom: 120, width: 100, height: 20 });
    const pos = computeAnchorPosition(anchor, { side: "top" });
    expect(pos.top).toBe(96); // top - offset
    expect(pos.transform).toBe("translate(0, -100%)");
  });

  it("centers along the horizontal axis for align='center'", () => {
    const anchor = makeAnchor({ top: 100, left: 50, right: 150, bottom: 120, width: 100, height: 20 });
    const pos = computeAnchorPosition(anchor, { align: "center" });
    expect(pos.left).toBe(100); // left + width / 2
    expect(pos.transform).toBe("translate(-50%, 0)");
  });

  it("right-aligns the content for align='end'", () => {
    const anchor = makeAnchor({ top: 100, left: 50, right: 150, bottom: 120, width: 100, height: 20 });
    const pos = computeAnchorPosition(anchor, { align: "end" });
    expect(pos.left).toBe(150); // right edge
    expect(pos.transform).toBe("translate(-100%, 0)");
  });

  it("places to the right of the anchor for side='right'", () => {
    const anchor = makeAnchor({ top: 100, left: 50, right: 150, bottom: 120, width: 100, height: 20 });
    const pos = computeAnchorPosition(anchor, { side: "right" });
    expect(pos.left).toBe(154); // right + offset
    expect(pos.top).toBe(100); // align start -> top edge
  });

  it("places to the left of the anchor for side='left'", () => {
    const anchor = makeAnchor({ top: 100, left: 50, right: 150, bottom: 120, width: 100, height: 20 });
    const pos = computeAnchorPosition(anchor, { side: "left" });
    expect(pos.left).toBe(46); // left - offset
    expect(pos.transform).toBe("translate(-100%, 0)");
  });

  it("vertically centers for side='right'/align='center'", () => {
    const anchor = makeAnchor({ top: 100, left: 50, right: 150, bottom: 120, width: 100, height: 20 });
    const pos = computeAnchorPosition(anchor, { side: "right", align: "center" });
    expect(pos.top).toBe(110); // top + height / 2
    expect(pos.transform).toBe("translate(0, -50%)");
  });

  it("aligns to the bottom edge for side='right'/align='end'", () => {
    const anchor = makeAnchor({ top: 100, left: 50, right: 150, bottom: 120, width: 100, height: 20 });
    const pos = computeAnchorPosition(anchor, { side: "right", align: "end" });
    expect(pos.top).toBe(120); // bottom edge
    expect(pos.transform).toBe("translate(0, -100%)");
  });

  it("respects a custom offset", () => {
    const anchor = makeAnchor({ top: 100, left: 50, right: 150, bottom: 120, width: 100, height: 20 });
    const pos = computeAnchorPosition(anchor, { offset: 12 });
    expect(pos.top).toBe(132);
  });
});
