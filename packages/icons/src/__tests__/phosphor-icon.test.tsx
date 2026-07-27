// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@praxisjs/runtime";

import { PhosphorIcon } from "../phosphor-icon/phosphor-icon";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

const PLUS_REGULAR =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/></svg>';

describe("PhosphorIcon", () => {
  it("renders the asset's own viewBox and inner markup", () => {
    const container = mount(() => <PhosphorIcon svg={PLUS_REGULAR} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 256 256");
    expect(svg?.querySelector("path")).toBeTruthy();
  });

  it("preserves fill=\"currentColor\" from the asset's outer <svg> tag, so `color` actually paints it", () => {
    const container = mount(() => <PhosphorIcon svg={PLUS_REGULAR} color="tomato" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("fill")).toBe("currentColor");
    expect(svg?.getAttribute("color")).toBe("tomato");
  });

  it("applies size and color", () => {
    const container = mount(() => <PhosphorIcon svg={PLUS_REGULAR} size={32} color="tomato" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("32");
    expect(svg?.getAttribute("height")).toBe("32");
    expect(svg?.getAttribute("color")).toBe("tomato");
  });

  it("flips horizontally when mirrored", () => {
    const container = mount(() => <PhosphorIcon svg={PLUS_REGULAR} mirrored />);
    const svg = container.querySelector("svg") as (SVGSVGElement & { style: CSSStyleDeclaration }) | null;
    expect(svg?.style.transform).toBe("scaleX(-1)");
  });

  it("is aria-hidden by default and exposed as an img when aria-label is set", () => {
    const hidden = mount(() => <PhosphorIcon svg={PLUS_REGULAR} />);
    expect(hidden.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");

    const labeled = mount(() => <PhosphorIcon svg={PLUS_REGULAR} aria-label="Add" />);
    const svg = labeled.querySelector("svg");
    expect(svg?.getAttribute("role")).toBe("img");
    expect(svg?.getAttribute("aria-label")).toBe("Add");
  });
});
