// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@praxisjs/runtime";

import { Icon, resolveMarkup } from "../icon/icon";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("resolveMarkup", () => {
  it("strips a full <svg> wrapper and reads its viewBox", () => {
    const { markup, viewBox } = resolveMarkup(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M1"/></svg>',
      "0 0 24 24",
    );
    expect(viewBox).toBe("0 0 256 256");
    expect(markup).toBe('<path d="M1"/>');
  });

  it("preserves fill/stroke from the outer <svg> tag instead of discarding them with it", () => {
    const fillOnly = resolveMarkup(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M1"/></svg>',
      "0 0 24 24",
    );
    expect(fillOnly.fill).toBe("currentColor");
    expect(fillOnly.stroke).toBeUndefined();

    const strokeOnly = resolveMarkup(
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M1"/></svg>',
      "0 0 24 24",
    );
    expect(strokeOnly.fill).toBe("none");
    expect(strokeOnly.stroke).toBe("currentColor");
  });

  it("falls back to the given viewBox when svg has none", () => {
    const { markup, viewBox } = resolveMarkup("<svg><path d=\"M1\"/></svg>", "0 0 24 24");
    expect(viewBox).toBe("0 0 24 24");
    expect(markup).toBe('<path d="M1"/>');
  });

  it("treats bare inner markup as-is", () => {
    const { markup, viewBox } = resolveMarkup('<path d="M1"/>', "0 0 24 24");
    expect(markup).toBe('<path d="M1"/>');
    expect(viewBox).toBe("0 0 24 24");
  });
});

describe("Icon", () => {
  it("renders the markup inside an svg sized by `size`", () => {
    const container = mount(() => <Icon svg='<path d="M5 12h14"/>' size={32} id="i1" class="ic" />);
    const svg = container.querySelector("svg");
    expect(svg?.id).toBe("i1");
    expect(svg?.getAttribute("class")).toBe("ic");
    expect(svg?.getAttribute("width")).toBe("32");
    expect(svg?.getAttribute("height")).toBe("32");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
    expect(svg?.querySelector("path")?.getAttribute("d")).toBe("M5 12h14");
  });

  it("extracts viewBox from a full <svg> string", () => {
    const container = mount(() => (
      <Icon svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M1"/></svg>' />
    ));
    expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe("0 0 256 256");
  });

  it("is aria-hidden by default and exposed as an img when aria-label is set", () => {
    const hidden = mount(() => <Icon svg='<path d="M1"/>' />);
    expect(hidden.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(hidden.querySelector("svg")?.hasAttribute("role")).toBe(false);

    const labeled = mount(() => <Icon svg='<path d="M1"/>' aria-label="Add" />);
    const svg = labeled.querySelector("svg");
    expect(svg?.getAttribute("role")).toBe("img");
    expect(svg?.getAttribute("aria-label")).toBe("Add");
    expect(svg?.hasAttribute("aria-hidden")).toBe(false);
  });

  it("sets the color attribute so currentColor fills/strokes resolve against it", () => {
    const container = mount(() => <Icon svg='<path d="M1"/>' color="tomato" />);
    expect(container.querySelector("svg")?.getAttribute("color")).toBe("tomato");
  });
});
