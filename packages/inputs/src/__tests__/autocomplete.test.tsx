// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render } from "@praxisjs/runtime";

import { Autocomplete } from "../autocomplete/autocomplete";
import type { AutocompleteSuggestion } from "../autocomplete/autocomplete.types";

const SUGGESTIONS: AutocompleteSuggestion[] = [
  { value: "tokyo", label: "Tokyo" },
  { value: "london", label: "London" },
  { value: "paris", label: "Paris" },
];

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  render(node as () => Node, container);
  return container;
}

describe("Autocomplete render", () => {
  it("renders a closed combobox input with no listbox", () => {
    const container = mount(() => (
      <Autocomplete
        suggestions={SUGGESTIONS}
        placeholder="Search..."
        id="ac-1"
        class="ac"
        aria-label="al"
        aria-labelledby="alb"
        aria-describedby="adb"
      />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.id).toBe("ac-1");
    expect(input.placeholder).toBe("Search...");
    expect(input.getAttribute("role")).toBe("combobox");
    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(input.getAttribute("aria-label")).toBe("al");
    expect(input.getAttribute("aria-labelledby")).toBe("alb");
    expect(input.getAttribute("aria-describedby")).toBe("adb");
    expect(input.hasAttribute("aria-activedescendant")).toBe(false);
    expect(container.querySelector(".ac")).toBeTruthy();
    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });

  it("generates a fallback id when none is provided", () => {
    const container = mount(() => <Autocomplete suggestions={SUGGESTIONS} />);
    expect((container.querySelector("input") as HTMLInputElement).id).toMatch(/^autocomplete-input-/);
  });

  it("typing opens the dropdown and lists filtered suggestions", () => {
    const onValueChange = vi.fn();
    const container = mount(() => <Autocomplete suggestions={SUGGESTIONS} onValueChange={onValueChange} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.value = "to";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(onValueChange).toHaveBeenCalledWith("to");
    expect(input.getAttribute("aria-expanded")).toBe("true");
    const options = container.querySelectorAll('[role="option"]');
    expect(options).toHaveLength(1);
    expect(options[0].textContent).toBe("Tokyo");
  });

  it("clearing the input closes the dropdown", () => {
    const container = mount(() => <Autocomplete suggestions={SUGGESTIONS} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.value = "t";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(input.getAttribute("aria-expanded")).toBe("true");
    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("clicking a suggestion selects it and fires both callbacks", () => {
    const onSuggestionSelect = vi.fn();
    const onValueChange = vi.fn();
    const container = mount(() => (
      <Autocomplete suggestions={SUGGESTIONS} onSuggestionSelect={onSuggestionSelect} onValueChange={onValueChange} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    input.value = "o";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    const options = container.querySelectorAll('[role="option"]');
    (options[0] as HTMLElement).click();
    expect(onSuggestionSelect).toHaveBeenCalled();
    expect(onValueChange).toHaveBeenCalled();
    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });

  it("falls back to the suggestion's value when no label is given, for both filtering text and rendered text", () => {
    const noLabel: AutocompleteSuggestion[] = [{ value: "berlin" }];
    const container = mount(() => <Autocomplete suggestions={noLabel} defaultValue="ber" />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    const options = container.querySelectorAll('[role="option"]');
    expect(options).toHaveLength(1);
    expect(options[0].textContent).toBe("berlin");
  });

  it("clicking a stray <li> with a malformed or out-of-range id is a no-op (defensive bounds checks)", () => {
    const onSuggestionSelect = vi.fn();
    const container = mount(() => (
      <Autocomplete suggestions={SUGGESTIONS} defaultValue="o" onSuggestionSelect={onSuggestionSelect} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    const root = container.firstElementChild as HTMLElement;

    const stray = document.createElement("li");
    stray.id = "not-a-valid-id";
    root.appendChild(stray);
    stray.click();
    expect(onSuggestionSelect).not.toHaveBeenCalled();

    stray.id = "-1"; // parses to a valid but negative index
    stray.click();
    expect(onSuggestionSelect).not.toHaveBeenCalled();

    stray.id = "999"; // parses to a valid but out-of-range index
    stray.click();
    expect(onSuggestionSelect).not.toHaveBeenCalled();
  });

  it("clicking outside any option while open is a no-op (no matching li)", () => {
    const container = mount(() => <Autocomplete suggestions={SUGGESTIONS} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.value = "o";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    const root = container.firstElementChild as HTMLElement;
    expect(() => { root.click(); }).not.toThrow();
    expect(container.querySelector('[role="listbox"]')).toBeTruthy();
  });

  it("clicking while closed does nothing", () => {
    const container = mount(() => <Autocomplete suggestions={SUGGESTIONS} />);
    const root = container.firstElementChild as HTMLElement;
    expect(() => { root.click(); }).not.toThrow();
  });

  it("ArrowDown opens the closed list with a value present and highlights the first option", () => {
    const container = mount(() => <Autocomplete suggestions={SUGGESTIONS} defaultValue="o" />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    expect(input.getAttribute("aria-expanded")).toBe("true");
    const options = container.querySelectorAll('[role="option"]');
    expect(options[0].getAttribute("data-active")).toBe("");
    expect(input.getAttribute("aria-activedescendant")).toBe(options[0].id);
  });

  it("ArrowDown with no value does not open the list", () => {
    const container = mount(() => <Autocomplete suggestions={SUGGESTIONS} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("ArrowDown while open cycles through options with wraparound", () => {
    const container = mount(() => <Autocomplete suggestions={SUGGESTIONS} defaultValue="o" />);
    const input = container.querySelector("input") as HTMLInputElement;
    const down = () => input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    down(); // opens, activeIndex 0 (london)
    down(); // -> 1 (paris)
    let options = container.querySelectorAll('[role="option"]');
    expect(options[1].getAttribute("data-active")).toBe("");
    down(); // wraps to 0
    options = container.querySelectorAll('[role="option"]');
    expect(options[0].getAttribute("data-active")).toBe("");
  });

  it("ArrowUp wraps to the last option when already open and at index 0", () => {
    const container = mount(() => <Autocomplete suggestions={SUGGESTIONS} defaultValue="o" />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true })); // opens, index 0
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true, cancelable: true })); // wraps to last
    const options = container.querySelectorAll('[role="option"]');
    expect(options[options.length - 1].getAttribute("data-active")).toBe("");
  });

  it("ArrowUp from a non-zero index decrements normally (no wrap)", () => {
    const container = mount(() => <Autocomplete suggestions={SUGGESTIONS} defaultValue="o" />);
    const input = container.querySelector("input") as HTMLInputElement;
    const down = () => input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    down(); // opens, activeIndex 0
    down(); // -> 1
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true, cancelable: true })); // -> 0
    const options = container.querySelectorAll('[role="option"]');
    expect(options[0].getAttribute("data-active")).toBe("");
  });

  it("ArrowUp alone does not open the dropdown", () => {
    const container = mount(() => <Autocomplete suggestions={SUGGESTIONS} defaultValue="o" />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true, cancelable: true }));
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("Enter selects the active option", () => {
    const onSuggestionSelect = vi.fn();
    const container = mount(() => (
      <Autocomplete suggestions={SUGGESTIONS} defaultValue="tok" onSuggestionSelect={onSuggestionSelect} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    expect(onSuggestionSelect).toHaveBeenCalledWith(SUGGESTIONS[0]);
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("Enter does nothing when closed or no active index", () => {
    const onSuggestionSelect = vi.fn();
    const container = mount(() => (
      <Autocomplete suggestions={SUGGESTIONS} onSuggestionSelect={onSuggestionSelect} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    expect(onSuggestionSelect).not.toHaveBeenCalled();
  });

  it("Escape closes the dropdown", () => {
    const container = mount(() => <Autocomplete suggestions={SUGGESTIONS} defaultValue="o" />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("Tab closes the dropdown", () => {
    const container = mount(() => <Autocomplete suggestions={SUGGESTIONS} defaultValue="o" />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }));
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("other keys do not affect state", () => {
    const container = mount(() => <Autocomplete suggestions={SUGGESTIONS} />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(() => {
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true }));
    }).not.toThrow();
  });

  it("blurring to an unrelated element closes the dropdown", () => {
    const container = mount(() => <Autocomplete suggestions={SUGGESTIONS} defaultValue="o" />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    const outside = document.createElement("button");
    document.body.appendChild(outside);
    input.dispatchEvent(new FocusEvent("blur", { relatedTarget: outside }));
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("blurring to the listbox itself does not close the dropdown", () => {
    const container = mount(() => <Autocomplete suggestions={SUGGESTIONS} defaultValue="o" />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    const listbox = container.querySelector('[role="listbox"]') as HTMLElement;
    input.dispatchEvent(new FocusEvent("blur", { relatedTarget: listbox }));
    expect(input.getAttribute("aria-expanded")).toBe("true");
  });

  it("blur with no relatedTarget closes the dropdown", () => {
    const container = mount(() => <Autocomplete suggestions={SUGGESTIONS} defaultValue="o" />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    input.dispatchEvent(new FocusEvent("blur"));
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("is disabled and shows data-disabled when disabled", () => {
    const container = mount(() => <Autocomplete suggestions={SUGGESTIONS} disabled />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(container.firstElementChild?.getAttribute("data-disabled")).toBe("");
  });

  it("uses a custom filterFn", () => {
    const filterFn = vi.fn((s: AutocompleteSuggestion, q: string) => s.value.startsWith(q));
    const container = mount(() => <Autocomplete suggestions={SUGGESTIONS} filterFn={filterFn} defaultValue="lon" />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    expect(filterFn).toHaveBeenCalled();
    expect(container.querySelectorAll('[role="option"]')).toHaveLength(1);
  });
});
