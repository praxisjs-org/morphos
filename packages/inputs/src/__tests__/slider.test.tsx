// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render } from "@praxisjs/runtime";

import { Slider } from "../slider/slider";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("Slider", () => {
  it("renders with defaults (min as initial value)", () => {
    const container = mount(() => <Slider />);
    const root = container.querySelector('[role="presentation"]');
    const input = container.querySelector("input") as HTMLInputElement;
    expect(root?.getAttribute("data-orientation")).toBe("horizontal");
    expect(root?.getAttribute("data-value")).toBe("0");
    expect(input.getAttribute("aria-orientation")).toBe("horizontal");
    expect(input.getAttribute("aria-valuemin")).toBe("0");
    expect(input.getAttribute("aria-valuemax")).toBe("100");
    expect(input.getAttribute("aria-valuenow")).toBe("0");
    expect(input.value).toBe("0");
  });

  it("uses defaultValue as the initial value", () => {
    const container = mount(() => <Slider defaultValue={40} min={0} max={100} />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.value).toBe("40");
  });

  it("prefers the controlled value over defaultValue", () => {
    const container = mount(() => <Slider value={70} defaultValue={10} />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.value).toBe("70");
  });

  it("applies static attributes and disabled/class/id", () => {
    const container = mount(() => (
      <Slider
        id="sl-1"
        class="sl"
        name="vol"
        min={10}
        max={20}
        step={2}
        disabled
        aria-label="al"
        aria-labelledby="alb"
        aria-describedby="adb"
      />
    ));
    const root = container.querySelector('[role="presentation"]');
    const input = container.querySelector("input") as HTMLInputElement;
    expect(root?.className).toBe("sl");
    expect(root?.getAttribute("data-disabled")).toBe("");
    expect(input.id).toBe("sl-1");
    expect(input.name).toBe("vol");
    expect(input.min).toBe("10");
    expect(input.max).toBe("20");
    expect(input.step).toBe("2");
    expect(input.disabled).toBe(true);
    expect(input.getAttribute("aria-label")).toBe("al");
    expect(input.getAttribute("aria-labelledby")).toBe("alb");
    expect(input.getAttribute("aria-describedby")).toBe("adb");
  });

  it("omits data-disabled when enabled", () => {
    const container = mount(() => <Slider />);
    const root = container.querySelector('[role="presentation"]');
    expect(root?.hasAttribute("data-disabled")).toBe(false);
  });

  it("computes percentage for the CSS variable based on value/min/max", () => {
    const container = mount(() => <Slider defaultValue={25} min={0} max={50} />);
    const root = container.querySelector('[role="presentation"]') as HTMLElement;
    expect(root.style.getPropertyValue("--slider-value")).toBe("50%");
  });

  it("percentage is 0 when min equals max (zero range)", () => {
    const container = mount(() => <Slider min={5} max={5} defaultValue={5} />);
    const root = container.querySelector('[role="presentation"]') as HTMLElement;
    expect(root.style.getPropertyValue("--slider-value")).toBe("0%");
  });

  it("updates value on input and clamps to [min, max], firing onValueChange", () => {
    const onValueChange = vi.fn();
    const container = mount(() => <Slider min={0} max={10} onValueChange={onValueChange} />);
    const input = container.querySelector("input") as HTMLInputElement;

    input.value = "5";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(onValueChange).toHaveBeenLastCalledWith(5);
    expect(input.value).toBe("5");

    input.value = "999";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(onValueChange).toHaveBeenLastCalledWith(10);

    input.value = "-999";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(onValueChange).toHaveBeenLastCalledWith(0);
  });

  it("still emits onValueChange when controlled (parent decides whether to apply it)", () => {
    const onValueChange = vi.fn();
    const sliderInstance = new Slider({ value: 5, onValueChange });
    sliderInstance.onBeforeMount?.();
    (sliderInstance as unknown as { _setValue: (v: number) => number })._setValue(8);
    expect(onValueChange).toHaveBeenCalledWith(8);
    expect(sliderInstance.currentValue).toBe(5);
  });

  it("supports vertical orientation", () => {
    const container = mount(() => <Slider orientation="vertical" />);
    const root = container.querySelector('[role="presentation"]');
    const input = container.querySelector("input");
    expect(root?.getAttribute("data-orientation")).toBe("vertical");
    expect(input?.getAttribute("aria-orientation")).toBe("vertical");
  });
});
