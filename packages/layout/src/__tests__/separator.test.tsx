// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@praxisjs/runtime";

import { Separator } from "../separator/separator";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("Separator", () => {
  it("defaults to horizontal, non-decorative", () => {
    const container = mount(() => <Separator />);
    const el = container.querySelector('[role="separator"]');
    expect(el?.getAttribute("data-orientation")).toBe("horizontal");
    expect(el?.getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("supports vertical orientation", () => {
    const container = mount(() => <Separator orientation="vertical" />);
    const el = container.querySelector('[role="separator"]');
    expect(el?.getAttribute("data-orientation")).toBe("vertical");
    expect(el?.getAttribute("aria-orientation")).toBe("vertical");
  });

  it("applies id and class", () => {
    const container = mount(() => <Separator id="sep-1" class="my-sep" />);
    const el = container.querySelector("#sep-1");
    expect(el?.className).toBe("my-sep");
  });

  it("renders decorative (aria-hidden, no role) when decorative is true", () => {
    const container = mount(() => <Separator decorative />);
    const el = container.querySelector("div");
    expect(el?.getAttribute("aria-hidden")).toBe("true");
    expect(el?.hasAttribute("role")).toBe(false);
    expect(el?.getAttribute("data-orientation")).toBe("horizontal");
  });

  it("decorative + vertical orientation", () => {
    const container = mount(() => <Separator decorative orientation="vertical" />);
    const el = container.querySelector("div");
    expect(el?.getAttribute("data-orientation")).toBe("vertical");
  });

  it("applies id and class in decorative mode", () => {
    const container = mount(() => <Separator decorative id="sep-2" class="deco" />);
    const el = container.querySelector("#sep-2");
    expect(el?.className).toBe("deco");
  });
});
