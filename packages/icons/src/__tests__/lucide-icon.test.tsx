// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@praxisjs/runtime";

import { LucideIcon } from "../lucide-icon/lucide-icon";
import type { IconNode } from "../lucide-icon/lucide-icon.types";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

const PLUS: IconNode = [
  ["path", { d: "M5 12h14" }],
  ["path", { d: "M12 5v14" }],
];

const CIRCLE_PLUS: IconNode = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M8 12h8" }],
];

describe("LucideIcon", () => {
  it("renders each node as the matching SVG child, in order", () => {
    const container = mount(() => <LucideIcon icon={PLUS} />);
    const svg = container.querySelector("svg");
    const paths = svg?.querySelectorAll("path");
    expect(paths?.length).toBe(2);
    expect(paths?.[0].getAttribute("d")).toBe("M5 12h14");
    expect(paths?.[1].getAttribute("d")).toBe("M12 5v14");
  });

  it("supports non-path shapes like circle", () => {
    const container = mount(() => <LucideIcon icon={CIRCLE_PLUS} />);
    const circle = container.querySelector("circle");
    expect(circle?.getAttribute("cx")).toBe("12");
    expect(circle?.getAttribute("r")).toBe("10");
  });

  it("defaults to a 24x24 viewBox, currentColor stroke, and stroke-width 2", () => {
    const container = mount(() => <LucideIcon icon={PLUS} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
    expect(svg?.getAttribute("fill")).toBe("none");
    expect(svg?.getAttribute("stroke")).toBe("currentColor");
    expect(svg?.getAttribute("stroke-width")).toBe("2");
    expect(svg?.getAttribute("stroke-linecap")).toBe("round");
    expect(svg?.getAttribute("stroke-linejoin")).toBe("round");
  });

  it("applies size to width/height and color to stroke", () => {
    const container = mount(() => <LucideIcon icon={PLUS} size={32} color="tomato" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("32");
    expect(svg?.getAttribute("height")).toBe("32");
    expect(svg?.getAttribute("stroke")).toBe("tomato");
  });

  it("scales strokeWidth with absoluteStrokeWidth so it stays visually constant", () => {
    const container = mount(() => <LucideIcon icon={PLUS} size={48} strokeWidth={2} absoluteStrokeWidth />);
    // 2 * 24 / 48 = 1
    expect(container.querySelector("svg")?.getAttribute("stroke-width")).toBe("1");
  });

  it("is aria-hidden by default and exposed as an img when aria-label is set", () => {
    const hidden = mount(() => <LucideIcon icon={PLUS} />);
    expect(hidden.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");

    const labeled = mount(() => <LucideIcon icon={PLUS} aria-label="Add" />);
    const svg = labeled.querySelector("svg");
    expect(svg?.getAttribute("role")).toBe("img");
    expect(svg?.getAttribute("aria-label")).toBe("Add");
  });
});
