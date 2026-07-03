// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render } from "@praxisjs/runtime";

import { Switch } from "../switch/switch";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("Switch", () => {
  it("renders unchecked, enabled by default, no hidden input without name", () => {
    const container = mount(() => <Switch>Label</Switch>);
    const button = container.querySelector('[role="switch"]') as HTMLButtonElement;
    expect(button.getAttribute("aria-checked")).toBe("false");
    expect(button.hasAttribute("data-checked")).toBe(false);
    expect(button.hasAttribute("data-disabled")).toBe(false);
    expect(button.textContent).toBe("Label");
    expect(container.querySelector('input[type="checkbox"]')).toBeNull();
  });

  it("defaultChecked starts the switch on", () => {
    const container = mount(() => <Switch defaultChecked />);
    const button = container.querySelector('[role="switch"]');
    expect(button?.getAttribute("aria-checked")).toBe("true");
    expect(button?.getAttribute("data-checked")).toBe("");
  });

  it("renders a hidden checkbox input when name is set, synced to checked state", () => {
    const container = mount(() => <Switch name="wifi" value="on" defaultChecked />);
    const hidden = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(hidden.name).toBe("wifi");
    expect(hidden.value).toBe("on");
    expect(hidden.checked).toBe(true);
    expect(hidden.tabIndex).toBe(-1);
  });

  it("clicking toggles state in uncontrolled mode and fires onCheckedChange", () => {
    const onCheckedChange = vi.fn();
    const container = mount(() => <Switch onCheckedChange={onCheckedChange} />);
    const button = container.querySelector('[role="switch"]') as HTMLButtonElement;
    button.click();
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(button.getAttribute("aria-checked")).toBe("true");
    button.click();
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
  });

  it("does not toggle or fire onCheckedChange when disabled", () => {
    const onCheckedChange = vi.fn();
    const container = mount(() => <Switch disabled onCheckedChange={onCheckedChange} />);
    const button = container.querySelector('[role="switch"]') as HTMLButtonElement;
    expect(button.getAttribute("data-disabled")).toBe("");
    button.click();
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("_handleClick's disabled guard is exercised directly (native disabled buttons don't dispatch click)", () => {
    const onCheckedChange = vi.fn();
    const sw = new Switch({ disabled: true, onCheckedChange });
    (sw as unknown as { _handleClick: () => void })._handleClick();
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("does not update internal state when controlled via checked prop", () => {
    const onCheckedChange = vi.fn();
    const container = mount(() => <Switch checked={true} onCheckedChange={onCheckedChange} />);
    const button = container.querySelector('[role="switch"]') as HTMLButtonElement;
    button.click();
    expect(onCheckedChange).toHaveBeenCalledWith(false);
    expect(button.getAttribute("aria-checked")).toBe("true");
  });

  it("Space and Enter activate the switch, other keys do nothing", () => {
    const onCheckedChange = vi.fn();
    const container = mount(() => <Switch onCheckedChange={onCheckedChange} />);
    const button = container.querySelector('[role="switch"]') as HTMLButtonElement;

    button.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    button.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);

    button.dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true }));
    expect(onCheckedChange).toHaveBeenCalledTimes(2);
  });

  it("ignores keydown when disabled", () => {
    const onCheckedChange = vi.fn();
    const container = mount(() => <Switch disabled onCheckedChange={onCheckedChange} />);
    const button = container.querySelector('[role="switch"]') as HTMLButtonElement;
    button.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true }));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("applies id, class and aria-* attributes", () => {
    const container = mount(() => (
      <Switch id="sw-1" class="sw" aria-label="al" aria-labelledby="alb" aria-describedby="adb" />
    ));
    const button = container.querySelector('[role="switch"]');
    expect(button?.id).toBe("sw-1");
    expect(button?.className).toBe("sw");
    expect(button?.getAttribute("aria-label")).toBe("al");
    expect(button?.getAttribute("aria-labelledby")).toBe("alb");
    expect(button?.getAttribute("aria-describedby")).toBe("adb");
  });
});
