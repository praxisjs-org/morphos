// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@praxisjs/runtime";

import { OtpField } from "../otp-field/otp-field";

afterEach(() => {
  document.body.innerHTML = "";
});

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  render(node as () => Node, container);
  return container;
}

function cells(container: HTMLDivElement): HTMLInputElement[] {
  return Array.from(container.querySelectorAll('input[data-index]')) as HTMLInputElement[];
}

function typeInto(input: HTMLInputElement, char: string) {
  input.value = char;
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function keydown(input: HTMLInputElement, key: string) {
  input.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

describe("OtpField", () => {
  it("renders `length` cells, defaulting to 6, none filled", () => {
    const container = mount(() => <OtpField />);
    const els = cells(container);
    expect(els).toHaveLength(6);
    els.forEach((el) => { expect(el.value).toBe(""); });
    expect(container.querySelector('input[type="hidden"]')).toBeNull();
  });

  it("respects a custom length and prefills from defaultValue", () => {
    const container = mount(() => <OtpField length={4} defaultValue="12" />);
    const els = cells(container);
    expect(els).toHaveLength(4);
    expect(els.map((e) => e.value)).toEqual(["1", "2", "", ""]);
  });

  it("renders a hidden input carrying the combined value when name is set", () => {
    const container = mount(() => <OtpField length={3} defaultValue="12" name="otp" />);
    const hidden = container.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hidden.name).toBe("otp");
    expect(hidden.value).toBe("12");
  });

  it("applies id, class, aria-label, disabled, pattern, inputMode per cell", () => {
    const container = mount(() => (
      <OtpField id="code" class="otp" aria-label="Verification code" disabled pattern="[a-z]" inputMode="text" length={2} />
    ));
    const els = cells(container);
    expect(container.querySelector("#code")).toBeTruthy();
    expect(container.querySelector(".otp")).toBeTruthy();
    expect(container.querySelector('[role="group"]')?.getAttribute("aria-label")).toBe("Verification code");
    expect(container.querySelector('[role="group"]')?.getAttribute("data-disabled")).toBe("");
    expect(els[0].id).toBe("code-0");
    expect(els[0].disabled).toBe(true);
    expect(els[0].pattern).toBe("[a-z]");
    expect(els[0].getAttribute("aria-label")).toBe("Digit 1 of 2");
    expect(els[1].getAttribute("aria-label")).toBe("Digit 2 of 2");
  });

  it("generates a base id per cell when no id prop is given", () => {
    const container = mount(() => <OtpField length={2} />);
    const els = cells(container);
    expect(els[0].id).toMatch(/^otp-\d+-0$/);
    expect(els[1].id).toMatch(/^otp-\d+-1$/);
  });

  it("typing advances focus to the next cell and calls onValueChange", () => {
    const onValueChange = vi.fn();
    const container = mount(() => <OtpField length={3} onValueChange={onValueChange} />);
    const els = cells(container);
    typeInto(els[0], "1");
    expect(els[0].value).toBe("1");
    expect(document.activeElement).toBe(els[1]);
    expect(onValueChange).toHaveBeenLastCalledWith("1");
  });

  it("typing in the last cell does not try to advance focus further", () => {
    const container = mount(() => <OtpField length={2} />);
    const els = cells(container);
    typeInto(els[1], "9");
    expect(els[1].value).toBe("9");
  });

  it("fires onComplete once all cells are filled", () => {
    const onComplete = vi.fn();
    const container = mount(() => <OtpField length={2} onComplete={onComplete} />);
    const els = cells(container);
    typeInto(els[0], "1");
    expect(onComplete).not.toHaveBeenCalled();
    typeInto(els[1], "2");
    expect(onComplete).toHaveBeenCalledWith("12");
  });

  it("Backspace on a filled cell clears it without moving focus", () => {
    const container = mount(() => <OtpField length={2} defaultValue="12" />);
    const els = cells(container);
    keydown(els[1], "Backspace");
    expect(els[1].value).toBe("");
    expect(document.activeElement).not.toBe(els[0]);
  });

  it("Backspace on an empty cell clears the previous cell and moves focus back", () => {
    const container = mount(() => <OtpField length={2} defaultValue="1" />);
    const els = cells(container);
    keydown(els[1], "Backspace");
    expect(els[0].value).toBe("");
    expect(document.activeElement).toBe(els[0]);
  });

  it("Backspace on the first, empty cell does nothing", () => {
    const container = mount(() => <OtpField length={2} />);
    const els = cells(container);
    keydown(els[0], "Backspace");
    expect(els[0].value).toBe("");
  });

  it("ArrowLeft/ArrowRight move focus between cells, clamped at the edges", () => {
    const container = mount(() => <OtpField length={3} />);
    const els = cells(container);
    els[1].focus();
    keydown(els[1], "ArrowLeft");
    expect(document.activeElement).toBe(els[0]);
    keydown(els[0], "ArrowLeft");
    expect(document.activeElement).toBe(els[0]);

    els[1].focus();
    keydown(els[1], "ArrowRight");
    expect(document.activeElement).toBe(els[2]);
    keydown(els[2], "ArrowRight");
    expect(document.activeElement).toBe(els[2]);
  });

  it("ignores unrelated keys", () => {
    const container = mount(() => <OtpField length={2} />);
    const els = cells(container);
    keydown(els[0], "a");
    expect(els[0].value).toBe("");
  });

  function dispatchPaste(el: HTMLInputElement, text: string | null) {
    const pasteEvent = new Event("paste", { bubbles: true, cancelable: true }) as ClipboardEvent;
    const clipboardData = text === null ? null : ({ getData: () => text } as unknown as DataTransfer);
    Object.defineProperty(pasteEvent, "clipboardData", { value: clipboardData });
    el.dispatchEvent(pasteEvent);
  }

  it("pasting distributes characters across cells and focuses the last filled one", async () => {
    const onComplete = vi.fn();
    const container = mount(() => <OtpField length={4} onComplete={onComplete} />);
    await Promise.resolve(); // onMount registers the paste listeners in a microtask
    const els = cells(container);
    dispatchPaste(els[0], "1234");
    expect(els.map((e) => e.value)).toEqual(["1", "2", "3", "4"]);
    expect(document.activeElement).toBe(els[3]);
    expect(onComplete).toHaveBeenCalledWith("1234");
  });

  it("paste starting mid-way only fills remaining cells", async () => {
    const container = mount(() => <OtpField length={4} />);
    await Promise.resolve();
    const els = cells(container);
    dispatchPaste(els[2], "99");
    expect(els.map((e) => e.value)).toEqual(["", "", "9", "9"]);
  });

  it("pasting empty clipboard data does nothing", async () => {
    const container = mount(() => <OtpField length={2} />);
    await Promise.resolve();
    const els = cells(container);
    dispatchPaste(els[0], "");
    expect(els.map((e) => e.value)).toEqual(["", ""]);
  });

  it("pasting when clipboardData is null does nothing", async () => {
    const container = mount(() => <OtpField length={2} />);
    await Promise.resolve();
    const els = cells(container);
    dispatchPaste(els[0], null);
    expect(els.map((e) => e.value)).toEqual(["", ""]);
  });

  it("controlled mode: typing, backspace, and paste all report the edited value without mutating internal state", async () => {
    const onValueChange = vi.fn();
    const container = mount(() => <OtpField length={2} value="ab" onValueChange={onValueChange} />);
    await Promise.resolve();
    const els = cells(container);
    expect(els.map((e) => e.value)).toEqual(["a", "b"]);

    typeInto(els[0], "x");
    expect(onValueChange).toHaveBeenLastCalledWith("xb");

    keydown(els[1], "Backspace");
    expect(onValueChange).toHaveBeenLastCalledWith("a");

    // `value` never actually changes (this simplified test doesn't feed onValueChange
    // back in), so `_getCells()` still resolves to ["a", "b"] on every interaction —
    // clearing cell 0 (filled with "a") yields "b", not a cumulative empty string.
    keydown(els[0], "Backspace");
    expect(onValueChange).toHaveBeenLastCalledWith("b");

    dispatchPaste(els[0], "zz");
    expect(onValueChange).toHaveBeenLastCalledWith("zz");
  });

  it("controlled mode: backspace on an already-empty first cell does not notify", async () => {
    const onValueChange = vi.fn();
    const container = mount(() => <OtpField length={2} value="" onValueChange={onValueChange} />);
    await Promise.resolve();
    const els = cells(container);
    keydown(els[0], "Backspace");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("controlled mode: backspace on an empty non-first cell clears the previous cell without mutating internal state", async () => {
    const onValueChange = vi.fn();
    const container = mount(() => <OtpField length={2} value="a" onValueChange={onValueChange} />);
    await Promise.resolve();
    const els = cells(container);
    keydown(els[1], "Backspace"); // cell 1 is empty ("a" only fills cell 0)
    expect(onValueChange).toHaveBeenCalledWith("");
    expect(document.activeElement).toBe(els[0]);
  });

  it("onMount tolerates a ref that never resolved to an element", () => {
    const field = new OtpField({ length: 1 });
    field.onBeforeMount?.();
    (field as unknown as { _inputRefs: (HTMLInputElement | null)[] })._inputRefs = [null];
    expect(() => { field.onMount?.(); }).not.toThrow();
  });

  it("unmount cleans up paste listeners without throwing", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const dispose = render(() => <OtpField length={2} />, container);
    await Promise.resolve();
    expect(() => { dispose(); }).not.toThrow();
  });
});
