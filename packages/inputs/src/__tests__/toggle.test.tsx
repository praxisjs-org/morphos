// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render } from "@praxisjs/runtime";

import { Toggle } from "../toggle/toggle";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("Toggle", () => {
  it("renders unpressed by default", () => {
    const container = mount(() => <Toggle>Bold</Toggle>);
    const button = container.querySelector("button") as HTMLButtonElement;
    expect(button.getAttribute("aria-pressed")).toBe("false");
    expect(button.hasAttribute("data-pressed")).toBe(false);
    expect(button.hasAttribute("data-disabled")).toBe(false);
    expect(button.textContent).toBe("Bold");
  });

  it("defaultPressed starts pressed", () => {
    const container = mount(() => <Toggle defaultPressed />);
    const button = container.querySelector("button");
    expect(button?.getAttribute("aria-pressed")).toBe("true");
    expect(button?.getAttribute("data-pressed")).toBe("");
  });

  it("clicking toggles state in uncontrolled mode and fires onPressedChange", () => {
    const onPressedChange = vi.fn();
    const container = mount(() => <Toggle onPressedChange={onPressedChange} />);
    const button = container.querySelector("button") as HTMLButtonElement;
    button.click();
    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(button.getAttribute("aria-pressed")).toBe("true");
    button.click();
    expect(onPressedChange).toHaveBeenLastCalledWith(false);
  });

  it("does not toggle when disabled", () => {
    const onPressedChange = vi.fn();
    const container = mount(() => <Toggle disabled onPressedChange={onPressedChange} />);
    const button = container.querySelector("button") as HTMLButtonElement;
    expect(button.getAttribute("data-disabled")).toBe("");
    button.click();
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it("_handleClick's disabled guard is exercised directly (native disabled buttons don't dispatch click)", () => {
    const onPressedChange = vi.fn();
    const tg = new Toggle({ disabled: true, onPressedChange });
    (tg as unknown as { _handleClick: () => void })._handleClick();
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it("still emits onPressedChange when controlled without flipping internal state", () => {
    const onPressedChange = vi.fn();
    const container = mount(() => <Toggle pressed={true} onPressedChange={onPressedChange} />);
    const button = container.querySelector("button") as HTMLButtonElement;
    button.click();
    expect(onPressedChange).toHaveBeenCalledWith(false);
    expect(button.getAttribute("aria-pressed")).toBe("true");
  });

  it("applies id, class and aria-* attributes", () => {
    const container = mount(() => (
      <Toggle id="tg-1" class="tg" aria-label="al" aria-labelledby="alb" aria-describedby="adb" />
    ));
    const button = container.querySelector("button");
    expect(button?.id).toBe("tg-1");
    expect(button?.className).toBe("tg");
    expect(button?.getAttribute("aria-label")).toBe("al");
    expect(button?.getAttribute("aria-labelledby")).toBe("alb");
    expect(button?.getAttribute("aria-describedby")).toBe("adb");
  });
});
