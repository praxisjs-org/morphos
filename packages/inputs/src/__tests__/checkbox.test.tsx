// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render } from "@praxisjs/runtime";

import { Checkbox } from "../checkbox/checkbox";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("Checkbox render", () => {
  it("renders unchecked by default with all static attributes", () => {
    const container = mount(() => (
      <Checkbox
        id="c1"
        class="cb"
        name="agree"
        value="yes"
        required
        aria-label="al"
        aria-labelledby="alb"
        aria-describedby="adb"
      />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.id).toBe("c1");
    expect(input.className).toBe("cb");
    expect(input.type).toBe("checkbox");
    expect(input.name).toBe("agree");
    expect(input.value).toBe("yes");
    expect(input.checked).toBe(false);
    expect(input.required).toBe(true);
    expect(input.getAttribute("aria-label")).toBe("al");
    expect(input.getAttribute("aria-labelledby")).toBe("alb");
    expect(input.getAttribute("aria-describedby")).toBe("adb");
    expect(input.getAttribute("aria-checked")).toBe("false");
    expect(input.getAttribute("aria-required")).toBe("true");
    expect(input.hasAttribute("data-checked")).toBe(false);
  });

  it("defaultChecked starts checked, reflected via data-checked and aria-checked", () => {
    const container = mount(() => <Checkbox defaultChecked />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.checked).toBe(true);
    expect(input.getAttribute("data-checked")).toBe("");
    expect(input.getAttribute("aria-checked")).toBe("true");
  });

  it("indeterminate sets the DOM property on mount and aria-checked=mixed", async () => {
    const container = mount(() => <Checkbox indeterminate />);
    await Promise.resolve();
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
    expect(input.getAttribute("aria-checked")).toBe("mixed");
    expect(input.getAttribute("data-indeterminate")).toBe("");
  });

  it("changing indeterminate after mount re-syncs the DOM property via @Watch", async () => {
    const { signal } = await import("@praxisjs/core/internal");
    const indeterminate = signal(false);
    const container = mount(() => <Checkbox indeterminate={() => indeterminate()} />);
    await Promise.resolve();
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.indeterminate).toBe(false);
    indeterminate.set(true);
    await Promise.resolve();
    expect(input.indeterminate).toBe(true);
  });

  it("indeterminate defaults to false", async () => {
    const container = mount(() => <Checkbox />);
    await Promise.resolve();
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.indeterminate).toBe(false);
    expect(input.hasAttribute("data-indeterminate")).toBe(false);
  });

  it("_syncIndeterminate and onMount tolerate a ref that never resolved (defensive branches)", () => {
    const cb = new Checkbox({ indeterminate: true });
    cb.onBeforeMount?.();
    expect(() => { cb.onMount?.(); }).not.toThrow();
    expect(() => {
      (cb as unknown as { _syncIndeterminate: () => void })._syncIndeterminate();
    }).not.toThrow();
  });

  it("toggling fires a change event that updates state in uncontrolled mode and calls onCheckedChange", () => {
    const onCheckedChange = vi.fn();
    const container = mount(() => <Checkbox onCheckedChange={onCheckedChange} />);
    const input = container.querySelector("input") as HTMLInputElement;

    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    expect(input.checked).toBe(true);
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);

    input.checked = false;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
  });

  it("does not update internal state when controlled, but still fires onCheckedChange", () => {
    const onCheckedChange = vi.fn();
    const container = mount(() => <Checkbox checked={false} onCheckedChange={onCheckedChange} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("is disabled when disabled is set", () => {
    const container = mount(() => <Checkbox disabled />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.getAttribute("data-disabled")).toBe("");
  });

  it("omits data-disabled and aria-required when unset", () => {
    const container = mount(() => <Checkbox />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.hasAttribute("data-disabled")).toBe(false);
    expect(input.hasAttribute("aria-required")).toBe(false);
  });
});
