// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@praxisjs/runtime";

import { Radio } from "../radio/radio";
import { RadioGroup } from "../radio/radio-group";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("RadioGroup render", () => {
  it("renders with default (vertical) orientation", () => {
    const container = mount(() => (
      <RadioGroup id="rg-1" class="rg" aria-label="al" aria-labelledby="alb">
        <div>child</div>
      </RadioGroup>
    ));
    const div = container.querySelector('[role="radiogroup"]');
    expect(div?.id).toBe("rg-1");
    expect(div?.className).toBe("rg");
    expect(div?.getAttribute("aria-label")).toBe("al");
    expect(div?.getAttribute("aria-labelledby")).toBe("alb");
    expect(div?.getAttribute("aria-orientation")).toBe("vertical");
    expect(div?.getAttribute("data-orientation")).toBe("vertical");
    expect(div?.querySelector("div")?.textContent).toBe("child");
  });

  it("renders horizontal orientation, required and disabled", () => {
    const container = mount(() => <RadioGroup orientation="horizontal" required disabled />);
    const div = container.querySelector('[role="radiogroup"]');
    expect(div?.getAttribute("aria-orientation")).toBe("horizontal");
    expect(div?.getAttribute("data-orientation")).toBe("horizontal");
    expect(div?.getAttribute("aria-required")).toBe("true");
    expect(div?.getAttribute("aria-disabled")).toBe("true");
    expect(div?.getAttribute("data-disabled")).toBe("");
  });

  it("omits aria-required/aria-disabled/data-disabled by default", () => {
    const container = mount(() => <RadioGroup />);
    const div = container.querySelector('[role="radiogroup"]');
    expect(div?.hasAttribute("aria-required")).toBe(false);
    expect(div?.hasAttribute("aria-disabled")).toBe(false);
    expect(div?.hasAttribute("data-disabled")).toBe(false);
  });
});

describe("Radio render", () => {
  it("renders unchecked, enabled by default", () => {
    const group = new RadioGroup({ name: "opt" });
    group.onBeforeMount?.();
    const container = mount(() => (
      <Radio group={group} value="a" id="r-a" class="ra" aria-label="al" aria-labelledby="alb">
        Option A
      </Radio>
    ));
    const label = container.querySelector("label");
    const input = container.querySelector("input") as HTMLInputElement;
    expect(label?.id).toBe("r-a");
    expect(label?.className).toBe("ra");
    expect(label?.hasAttribute("data-disabled")).toBe(false);
    expect(label?.hasAttribute("data-checked")).toBe(false);
    expect(input.type).toBe("radio");
    expect(input.name).toBe("opt");
    expect(input.value).toBe("a");
    expect(input.checked).toBe(false);
    expect(input.disabled).toBe(false);
    expect(input.getAttribute("aria-label")).toBe("al");
    expect(input.getAttribute("aria-labelledby")).toBe("alb");
    expect(label?.textContent).toBe("Option A");
  });

  it("reflects the group's selected value as checked/data-checked", () => {
    const group = new RadioGroup({ defaultValue: "a" });
    group.onBeforeMount?.();
    const container = mount(() => (
      <Radio group={group} value="a">
        A
      </Radio>
    ));
    const label = container.querySelector("label");
    const input = container.querySelector("input") as HTMLInputElement;
    expect(label?.getAttribute("data-checked")).toBe("");
    expect(input.checked).toBe(true);
  });

  it("selecting the radio calls group.select", () => {
    const group = new RadioGroup();
    group.onBeforeMount?.();
    const container = mount(() => (
      <Radio group={group} value="b">
        B
      </Radio>
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    expect(group.selectedValue).toBe("b");
  });

  it("is disabled when the group is disabled (own disabled prop unset)", () => {
    const group = new RadioGroup({ disabled: true });
    group.onBeforeMount?.();
    const container = mount(() => (
      <Radio group={group} value="a">
        A
      </Radio>
    ));
    const label = container.querySelector("label");
    const input = container.querySelector("input") as HTMLInputElement;
    expect(label?.getAttribute("data-disabled")).toBe("");
    expect(input.disabled).toBe(true);
  });

  it("own disabled prop overrides the group's disabled state", () => {
    const group = new RadioGroup({ disabled: false });
    group.onBeforeMount?.();
    const container = mount(() => (
      <Radio group={group} value="a" disabled>
        A
      </Radio>
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });
});
