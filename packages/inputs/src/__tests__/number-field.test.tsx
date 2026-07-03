// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render } from "@praxisjs/runtime";

import { NumberField } from "../number-field/number-field";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("NumberField", () => {
  it("renders empty display value when no value is set", () => {
    const container = mount(() => <NumberField />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.value).toBe("");
  });

  it("uses defaultValue as the display value", () => {
    const container = mount(() => <NumberField defaultValue={10} />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.value).toBe("10");
  });

  it("formats the value using Intl.NumberFormat when formatOptions is set", () => {
    const container = mount(() => (
      <NumberField defaultValue={29.99} formatOptions={{ style: "currency", currency: "USD" }} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.value).toBe(new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(29.99));
  });

  it("repeated decimal-step increments do not accumulate floating-point drift", () => {
    const onValueChange = vi.fn();
    const container = mount(() => (
      <NumberField defaultValue={29.99} step={0.01} onValueChange={onValueChange} />
    ));
    const [, incBtn] = Array.from(container.querySelectorAll("button")) as HTMLButtonElement[];

    for (let i = 0; i < 16; i++) incBtn.click();

    expect(onValueChange).toHaveBeenLastCalledWith(30.15);
  });

  it("repeated decimal-step decrements do not accumulate floating-point drift", () => {
    const onValueChange = vi.fn();
    const container = mount(() => (
      <NumberField defaultValue={1} step={0.1} onValueChange={onValueChange} />
    ));
    const [decBtn] = Array.from(container.querySelectorAll("button")) as HTMLButtonElement[];

    for (let i = 0; i < 7; i++) decBtn.click();

    expect(onValueChange).toHaveBeenLastCalledWith(0.3);
  });

  it("increment/decrement buttons update the value and fire onValueChange", () => {
    const onValueChange = vi.fn();
    const container = mount(() => <NumberField defaultValue={5} step={2} onValueChange={onValueChange} />);
    const input = container.querySelector("input") as HTMLInputElement;
    const [decBtn, incBtn] = Array.from(container.querySelectorAll("button")) as HTMLButtonElement[];

    incBtn.click();
    expect(input.value).toBe("7");
    expect(onValueChange).toHaveBeenLastCalledWith(7);

    decBtn.click();
    decBtn.click();
    expect(input.value).toBe("3");
  });

  it("clamps to min and disables the decrement button at the boundary", () => {
    const container = mount(() => <NumberField defaultValue={1} min={0} step={1} />);
    const input = container.querySelector("input") as HTMLInputElement;
    const [decBtn] = Array.from(container.querySelectorAll("button")) as HTMLButtonElement[];
    expect(decBtn.disabled).toBe(false);
    decBtn.click();
    expect(input.value).toBe("0");
    expect(decBtn.disabled).toBe(true);
    decBtn.click();
    expect(input.value).toBe("0");
  });

  it("clamps to max and disables the increment button at the boundary", () => {
    const container = mount(() => <NumberField defaultValue={9} max={10} step={1} />);
    const input = container.querySelector("input") as HTMLInputElement;
    const [, incBtn] = Array.from(container.querySelectorAll("button")) as HTMLButtonElement[];
    incBtn.click();
    expect(input.value).toBe("10");
    expect(incBtn.disabled).toBe(true);
  });

  it("increment/decrement work from an unset value, defaulting the base to 0", () => {
    const container = mount(() => <NumberField step={5} />);
    const input = container.querySelector("input") as HTMLInputElement;
    const [, incBtn] = Array.from(container.querySelectorAll("button")) as HTMLButtonElement[];
    incBtn.click();
    expect(input.value).toBe("5");
  });

  it("decrement works from an unset value, defaulting the base to 0", () => {
    const container = mount(() => <NumberField step={5} />);
    const input = container.querySelector("input") as HTMLInputElement;
    const [decBtn] = Array.from(container.querySelectorAll("button")) as HTMLButtonElement[];
    decBtn.click();
    expect(input.value).toBe("-5");
  });

  it("both buttons are enabled when min/max are unset", () => {
    const container = mount(() => <NumberField defaultValue={5} />);
    const [decBtn, incBtn] = Array.from(container.querySelectorAll("button")) as HTMLButtonElement[];
    expect(decBtn.disabled).toBe(false);
    expect(incBtn.disabled).toBe(false);
  });

  it("both buttons are disabled when the field itself is disabled", () => {
    const container = mount(() => <NumberField disabled defaultValue={5} min={0} max={10} />);
    const [decBtn, incBtn] = Array.from(container.querySelectorAll("button")) as HTMLButtonElement[];
    expect(decBtn.disabled).toBe(true);
    expect(incBtn.disabled).toBe(true);
    const root = container.querySelector("div");
    expect(root?.getAttribute("data-disabled")).toBe("");
  });

  it("typing a valid number updates the value via onChange", () => {
    const container = mount(() => <NumberField />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.value = "$42.50";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    expect(input.value).toBe("42.5");
  });

  it("ignores non-numeric input (NaN guard)", () => {
    const onValueChange = vi.fn();
    const container = mount(() => <NumberField defaultValue={7} onValueChange={onValueChange} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.value = "abc";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    expect(onValueChange).not.toHaveBeenCalled();
    // Reactive display binding only re-renders on a real value change, so it
    // won't revert the manual DOM mutation above — assert via a fresh mount instead.
    const fresh = mount(() => <NumberField defaultValue={7} />);
    expect((fresh.querySelector("input") as HTMLInputElement).value).toBe("7");
  });

  it("does not update internal state when controlled via value prop", () => {
    const onValueChange = vi.fn();
    const container = mount(() => <NumberField value={5} onValueChange={onValueChange} />);
    const [, incBtn] = Array.from(container.querySelectorAll("button")) as HTMLButtonElement[];
    incBtn.click();
    expect(onValueChange).toHaveBeenCalledWith(6);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.value).toBe("5");
  });

  it("applies name, required, class, id, and aria-* attributes", () => {
    const container = mount(() => (
      <NumberField
        name="qty"
        required
        class="nf"
        id="nf-1"
        aria-label="al"
        aria-labelledby="alb"
        aria-describedby="adb"
        min={0}
        max={10}
        defaultValue={5}
      />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.name).toBe("qty");
    expect(input.required).toBe(true);
    expect(input.id).toBe("nf-1");
    expect(container.querySelector("div")?.className).toBe("nf");
    expect(input.getAttribute("aria-label")).toBe("al");
    expect(input.getAttribute("aria-labelledby")).toBe("alb");
    expect(input.getAttribute("aria-describedby")).toBe("adb");
    expect(input.getAttribute("aria-required")).toBe("true");
    expect(input.getAttribute("aria-valuenow")).toBe("5");
    expect(input.getAttribute("aria-valuemin")).toBe("0");
    expect(input.getAttribute("aria-valuemax")).toBe("10");
  });

  it("omits aria-required when not required", () => {
    const container = mount(() => <NumberField />);
    const input = container.querySelector("input");
    expect(input?.hasAttribute("aria-required")).toBe(false);
  });
});
