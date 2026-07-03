// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render } from "@praxisjs/runtime";

import { ToggleGroup, ToggleGroupItem } from "../toggle-group/toggle-group";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("ToggleGroup — single", () => {
  it("renders with role=group and default attributes", () => {
    const container = mount(() => (
      <ToggleGroup type="single" id="tg-1" class="tg" aria-label="al" aria-labelledby="alb">
        <div>x</div>
      </ToggleGroup>
    ));
    const group = container.querySelector('[role="group"]');
    expect(group?.id).toBe("tg-1");
    expect(group?.className).toBe("tg");
    expect(group?.getAttribute("aria-label")).toBe("al");
    expect(group?.getAttribute("aria-labelledby")).toBe("alb");
    expect(group?.getAttribute("data-type")).toBe("single");
    expect(group?.getAttribute("data-orientation")).toBe("horizontal");
    expect(group?.getAttribute("aria-orientation")).toBe("horizontal");
    expect(group?.hasAttribute("aria-disabled")).toBe(false);
    expect(group?.hasAttribute("data-disabled")).toBe(false);
  });

  it("disabled group sets aria-disabled and data-disabled", () => {
    const container = mount(() => <ToggleGroup type="single" disabled />);
    const group = container.querySelector('[role="group"]');
    expect(group?.getAttribute("aria-disabled")).toBe("true");
    expect(group?.getAttribute("data-disabled")).toBe("");
  });

  it("supports vertical orientation", () => {
    const container = mount(() => <ToggleGroup type="single" orientation="vertical" />);
    const group = container.querySelector('[role="group"]');
    expect(group?.getAttribute("data-orientation")).toBe("vertical");
    expect(group?.getAttribute("aria-orientation")).toBe("vertical");
  });

  it("toggling an item selects it; toggling again deselects it (uncontrolled)", () => {
    const onValueChange = vi.fn();
    const group = new ToggleGroup({ type: "single", onValueChange });
    group.onBeforeMount?.();
    expect(group.isPressed("a")).toBe(false);

    group.toggle("a");
    expect(group.isPressed("a")).toBe(true);
    expect(onValueChange).toHaveBeenLastCalledWith("a");

    group.toggle("a");
    expect(group.isPressed("a")).toBe(false);
    expect(onValueChange).toHaveBeenLastCalledWith("");

    group.toggle("a");
    group.toggle("b");
    expect(group.isPressed("a")).toBe(false);
    expect(group.isPressed("b")).toBe(true);
  });

  it("respects a controlled value and still emits onValueChange", () => {
    const onValueChange = vi.fn();
    const group = new ToggleGroup({ type: "single", value: "a", onValueChange });
    group.onBeforeMount?.();
    group.toggle("b");
    expect(onValueChange).toHaveBeenCalledWith("b");
    expect(group.isPressed("a")).toBe(true);
    expect(group.isPressed("b")).toBe(false);
  });
});

describe("ToggleGroup — multiple", () => {
  it("defaultValue and toggling adds/removes values from the array", () => {
    const group = new ToggleGroup({ type: "multiple", defaultValue: ["a"] });
    group.onBeforeMount?.();
    expect(group.isPressed("a")).toBe(true);
    expect(group.isPressed("b")).toBe(false);

    group.toggle("b");
    expect(group.isPressed("a")).toBe(true);
    expect(group.isPressed("b")).toBe(true);

    group.toggle("a");
    expect(group.isPressed("a")).toBe(false);
    expect(group.isPressed("b")).toBe(true);
  });

  it("initialises to an empty array when no defaultValue is given", () => {
    const group = new ToggleGroup({ type: "multiple" });
    group.onBeforeMount?.();
    expect(group.isPressed("anything")).toBe(false);
  });

  it("guards against a non-array resolved value (defensive branch)", () => {
    // type="multiple" but a scalar controlled `value` was passed — resolvedValue
    // is not an array; toggle() should still treat the current selection as empty.
    const group = new ToggleGroup({ type: "multiple", value: "a" as unknown as string[] });
    group.onBeforeMount?.();
    const next = group.toggle("b");
    expect(next).toEqual(["b"]);
  });
});

describe("ToggleGroupItem", () => {
  it("reflects pressed state and forwards attributes", () => {
    const group = new ToggleGroup({ type: "single", defaultValue: "a" });
    group.onBeforeMount?.();
    const container = mount(() => (
      <ToggleGroupItem group={group} value="a" id="item-a" class="ta" aria-label="al" aria-labelledby="alb">
        A
      </ToggleGroupItem>
    ));
    const button = container.querySelector("button") as HTMLButtonElement;
    expect(button.id).toBe("item-a");
    expect(button.className).toBe("ta");
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(button.getAttribute("data-pressed")).toBe("");
    expect(button.getAttribute("aria-label")).toBe("al");
    expect(button.getAttribute("aria-labelledby")).toBe("alb");
    expect(button.disabled).toBe(false);
  });

  it("clicking toggles the group value", () => {
    const group = new ToggleGroup({ type: "single" });
    group.onBeforeMount?.();
    const container = mount(() => (
      <ToggleGroupItem group={group} value="a">A</ToggleGroupItem>
    ));
    const button = container.querySelector("button") as HTMLButtonElement;
    button.click();
    expect(group.isPressed("a")).toBe(true);
  });

  it("is disabled when the group is disabled (own disabled unset)", () => {
    const group = new ToggleGroup({ type: "single", disabled: true });
    group.onBeforeMount?.();
    const container = mount(() => (
      <ToggleGroupItem group={group} value="a">A</ToggleGroupItem>
    ));
    const button = container.querySelector("button") as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.getAttribute("data-disabled")).toBe("");
  });

  it("own disabled prop overrides group disabled state", () => {
    const group = new ToggleGroup({ type: "single", disabled: false });
    group.onBeforeMount?.();
    const container = mount(() => (
      <ToggleGroupItem group={group} value="a" disabled>A</ToggleGroupItem>
    ));
    const button = container.querySelector("button") as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it("clicking a disabled item does not toggle (direct handler invocation)", () => {
    const group = new ToggleGroup({ type: "single" });
    group.onBeforeMount?.();
    const toggleSpy = vi.spyOn(group, "toggle");
    const container = mount(() => (
      <ToggleGroupItem group={group} value="a" disabled>A</ToggleGroupItem>
    ));
    const button = container.querySelector("button") as HTMLButtonElement;
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(toggleSpy).not.toHaveBeenCalled();
  });
});
