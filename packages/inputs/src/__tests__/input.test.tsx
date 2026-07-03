// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render } from "@praxisjs/runtime";

import { Input } from "../input/input";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("Input", () => {
  it("renders with defaults", () => {
    const container = mount(() => <Input />);
    const input = container.querySelector("input");
    expect(input?.type).toBe("text");
    expect(input?.value).toBe("");
    expect(input?.hasAttribute("data-disabled")).toBe(false);
  });

  it("uses defaultValue when value is not controlled", () => {
    const container = mount(() => <Input defaultValue="hello" />);
    const input = container.querySelector("input");
    expect(input?.value).toBe("hello");
  });

  it("prefers the controlled value over defaultValue", () => {
    const container = mount(() => <Input value="controlled" defaultValue="uncontrolled" />);
    const input = container.querySelector("input");
    expect(input?.value).toBe("controlled");
  });

  it("applies all static attributes", () => {
    const container = mount(() => (
      <Input
        type="email"
        placeholder="you@example.com"
        disabled
        readonly
        required
        invalid
        name="email"
        autoComplete="email"
        maxLength={50}
        minLength={2}
        class="in"
        id="in-1"
        aria-label="al"
        aria-labelledby="alb"
        aria-describedby="adb"
      />
    ));
    const input = container.querySelector("input");
    expect(input?.type).toBe("email");
    expect(input?.placeholder).toBe("you@example.com");
    expect(input?.disabled).toBe(true);
    expect(input?.readOnly).toBe(true);
    expect(input?.required).toBe(true);
    expect(input?.getAttribute("aria-invalid")).toBe("true");
    expect(input?.getAttribute("aria-required")).toBe("true");
    expect(input?.name).toBe("email");
    expect(input?.autocomplete).toBe("email");
    expect(input?.maxLength).toBe(50);
    expect(input?.minLength).toBe(2);
    expect(input?.className).toBe("in");
    expect(input?.id).toBe("in-1");
    expect(input?.getAttribute("aria-label")).toBe("al");
    expect(input?.getAttribute("aria-labelledby")).toBe("alb");
    expect(input?.getAttribute("aria-describedby")).toBe("adb");
    expect(input?.getAttribute("data-disabled")).toBe("");
    expect(input?.getAttribute("data-invalid")).toBe("");
  });

  it("omits aria-invalid/aria-required and data-invalid when falsy", () => {
    const container = mount(() => <Input />);
    const input = container.querySelector("input");
    expect(input?.hasAttribute("aria-invalid")).toBe(false);
    expect(input?.hasAttribute("aria-required")).toBe(false);
    expect(input?.hasAttribute("data-invalid")).toBe(false);
  });

  it("tracks focus state via data-focused", () => {
    const container = mount(() => <Input />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.hasAttribute("data-focused")).toBe(false);
    input.dispatchEvent(new FocusEvent("focus"));
    expect(input.getAttribute("data-focused")).toBe("");
    input.dispatchEvent(new FocusEvent("blur"));
    expect(input.hasAttribute("data-focused")).toBe(false);
  });

  it("fires onInput and onChange with the new value", () => {
    const onInput = vi.fn();
    const onChange = vi.fn();
    const container = mount(() => <Input onInput={onInput} onChange={onChange} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.value = "abc";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    expect(onInput).toHaveBeenCalledWith("abc", expect.any(Event));
    expect(onChange).toHaveBeenCalledWith("abc", expect.any(Event));
  });

  it("fires onFocus and onBlur", () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const container = mount(() => <Input onFocus={onFocus} onBlur={onBlur} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus"));
    input.dispatchEvent(new FocusEvent("blur"));
    expect(onFocus).toHaveBeenCalledWith(expect.any(FocusEvent));
    expect(onBlur).toHaveBeenCalledWith(expect.any(FocusEvent));
  });
});
