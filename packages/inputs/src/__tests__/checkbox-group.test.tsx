// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render } from "@praxisjs/runtime";

import { CheckboxGroup, CheckboxGroupItem } from "../checkbox-group/checkbox-group";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("CheckboxGroup", () => {
  it("renders with role=group and default attributes", () => {
    const container = mount(() => (
      <CheckboxGroup id="cg-1" class="cg" aria-label="al" aria-labelledby="alb" aria-describedby="adb">
        <div>x</div>
      </CheckboxGroup>
    ));
    const group = container.querySelector('[role="group"]');
    expect(group?.id).toBe("cg-1");
    expect(group?.className).toBe("cg");
    expect(group?.getAttribute("aria-label")).toBe("al");
    expect(group?.getAttribute("aria-labelledby")).toBe("alb");
    expect(group?.getAttribute("aria-describedby")).toBe("adb");
    expect(group?.getAttribute("data-orientation")).toBe("vertical");
    expect(group?.getAttribute("aria-orientation")).toBe("vertical");
    expect(group?.hasAttribute("aria-required")).toBe(false);
    expect(group?.hasAttribute("aria-disabled")).toBe(false);
    expect(group?.hasAttribute("data-disabled")).toBe(false);
  });

  it("required and disabled group sets the corresponding attributes", () => {
    const container = mount(() => <CheckboxGroup required disabled />);
    const group = container.querySelector('[role="group"]');
    expect(group?.getAttribute("aria-required")).toBe("true");
    expect(group?.getAttribute("aria-disabled")).toBe("true");
    expect(group?.getAttribute("data-disabled")).toBe("");
  });

  it("supports horizontal orientation", () => {
    const container = mount(() => <CheckboxGroup orientation="horizontal" />);
    const group = container.querySelector('[role="group"]');
    expect(group?.getAttribute("data-orientation")).toBe("horizontal");
    expect(group?.getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("initialises from defaultValue and toggle adds/removes items (uncontrolled)", () => {
    const onValueChange = vi.fn();
    const group = new CheckboxGroup({ defaultValue: ["a"], onValueChange });
    group.onBeforeMount?.();
    expect(group.isChecked("a")).toBe(true);
    expect(group.isChecked("b")).toBe(false);

    group.toggle("b");
    expect(group.isChecked("b")).toBe(true);
    expect(onValueChange).toHaveBeenLastCalledWith(["a", "b"]);

    group.toggle("a");
    expect(group.isChecked("a")).toBe(false);
    expect(onValueChange).toHaveBeenLastCalledWith(["b"]);
  });

  it("initialises to an empty array without defaultValue", () => {
    const group = new CheckboxGroup();
    group.onBeforeMount?.();
    expect(group.isChecked("x")).toBe(false);
  });

  it("respects a controlled value and still emits onValueChange", () => {
    const onValueChange = vi.fn();
    const group = new CheckboxGroup({ value: ["a"], onValueChange });
    group.onBeforeMount?.();
    group.toggle("b");
    expect(onValueChange).toHaveBeenCalledWith(["a", "b"]);
    expect(group.isChecked("a")).toBe(true);
    expect(group.isChecked("b")).toBe(false);
  });
});

describe("CheckboxGroupItem", () => {
  it("reflects checked state and forwards attributes", () => {
    const group = new CheckboxGroup({ name: "opts", required: true, defaultValue: ["a"] });
    group.onBeforeMount?.();
    const container = mount(() => (
      <CheckboxGroupItem group={group} value="a" id="item-a" class="ia" aria-label="al" aria-labelledby="alb">
        A
      </CheckboxGroupItem>
    ));
    const label = container.querySelector("label");
    const input = container.querySelector("input") as HTMLInputElement;
    expect(label?.id).toBe("item-a");
    expect(label?.className).toBe("ia");
    expect(label?.getAttribute("data-checked")).toBe("");
    expect(input.name).toBe("opts");
    expect(input.value).toBe("a");
    expect(input.checked).toBe(true);
    expect(input.required).toBe(true);
    expect(input.getAttribute("aria-label")).toBe("al");
    expect(input.getAttribute("aria-labelledby")).toBe("alb");
    expect(label?.textContent).toBe("A");
  });

  it("clicking toggles the group value", () => {
    const group = new CheckboxGroup();
    group.onBeforeMount?.();
    const container = mount(() => (
      <CheckboxGroupItem group={group} value="a">A</CheckboxGroupItem>
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    expect(group.isChecked("a")).toBe(true);
  });

  it("is disabled when the group is disabled (own disabled unset)", () => {
    const group = new CheckboxGroup({ disabled: true });
    group.onBeforeMount?.();
    const container = mount(() => (
      <CheckboxGroupItem group={group} value="a">A</CheckboxGroupItem>
    ));
    const label = container.querySelector("label");
    const input = container.querySelector("input") as HTMLInputElement;
    expect(label?.getAttribute("data-disabled")).toBe("");
    expect(input.disabled).toBe(true);
  });

  it("own disabled prop overrides group disabled state", () => {
    const group = new CheckboxGroup({ disabled: false });
    group.onBeforeMount?.();
    const container = mount(() => (
      <CheckboxGroupItem group={group} value="a" disabled>A</CheckboxGroupItem>
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });
});
