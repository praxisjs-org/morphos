// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@praxisjs/runtime";

import { Meter } from "../meter/meter";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("Meter render", () => {
  it("renders role=meter with value/min/max and the CSS percentage variable", () => {
    const container = mount(() => (
      <Meter value={40} min={0} max={100} id="m1" class="me" aria-label="al" aria-labelledby="alb" />
    ));
    const meter = container.querySelector('[role="meter"]') as HTMLElement;
    expect(meter.id).toBe("m1");
    expect(meter.className).toBe("me");
    expect(meter.getAttribute("aria-label")).toBe("al");
    expect(meter.getAttribute("aria-labelledby")).toBe("alb");
    expect(meter.getAttribute("aria-valuenow")).toBe("40");
    expect(meter.getAttribute("aria-valuemin")).toBe("0");
    expect(meter.getAttribute("aria-valuemax")).toBe("100");
    expect(meter.getAttribute("data-value")).toBe("40");
    expect(meter.style.getPropertyValue("--meter-value")).toBe("40%");
    expect(meter.querySelector("[data-meter-fill]")).toBeTruthy();
  });

  it("sets data-low when the value is below the low threshold", () => {
    const container = mount(() => <Meter value={10} low={20} />);
    const meter = container.querySelector('[role="meter"]');
    expect(meter?.getAttribute("data-low")).toBe("");
    expect(meter?.hasAttribute("data-high")).toBe(false);
    expect(meter?.hasAttribute("data-optimum")).toBe(false);
  });

  it("sets data-high when the value is above the high threshold", () => {
    const container = mount(() => <Meter value={90} high={80} />);
    const meter = container.querySelector('[role="meter"]');
    expect(meter?.getAttribute("data-high")).toBe("");
  });

  it("sets data-optimum when the value matches optimum", () => {
    const container = mount(() => <Meter value={90} optimum={90} />);
    const meter = container.querySelector('[role="meter"]');
    expect(meter?.getAttribute("data-optimum")).toBe("");
  });

  it("omits data-low/data-high/data-optimum by default", () => {
    const container = mount(() => <Meter value={50} />);
    const meter = container.querySelector('[role="meter"]');
    expect(meter?.hasAttribute("data-low")).toBe(false);
    expect(meter?.hasAttribute("data-high")).toBe(false);
    expect(meter?.hasAttribute("data-optimum")).toBe(false);
  });
});
