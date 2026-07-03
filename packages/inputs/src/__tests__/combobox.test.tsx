// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render } from "@praxisjs/runtime";

import { Combobox } from "../combobox/combobox";
import type { ComboboxOption } from "../combobox/combobox.types";

const OPTIONS: ComboboxOption[] = [
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
  { value: "jp", label: "Japan" },
  { value: "xx", label: "Disabled", disabled: true },
];

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  render(node as () => Node, container);
  return container;
}

describe("Combobox render", () => {
  it("renders a closed combobox with no hidden input when name is unset", () => {
    const container = mount(() => (
      <Combobox
        options={OPTIONS}
        placeholder="Pick a country"
        id="cb-1"
        class="cb"
        aria-label="al"
        aria-labelledby="alb"
        aria-describedby="adb"
      />
    ));
    const root = container.querySelector('[role="combobox"]') as HTMLElement;
    expect(root.className).toBe("cb");
    expect(root.hasAttribute("data-open")).toBe(false);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.id).toBe("cb-1");
    expect(input.placeholder).toBe("Pick a country");
    expect(input.getAttribute("aria-label")).toBe("al");
    expect(input.getAttribute("aria-labelledby")).toBe("alb");
    expect(input.getAttribute("aria-describedby")).toBe("adb");
    expect(container.querySelector('input[type="hidden"]')).toBeNull();
    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });

  it("uses a generated fallback id when none provided", () => {
    const container = mount(() => <Combobox options={OPTIONS} />);
    expect((container.querySelector("input") as HTMLInputElement).id).toMatch(/^combobox-trigger-/);
  });

  it("renders a hidden input mirroring the selected value when name is set", () => {
    const container = mount(() => <Combobox options={OPTIONS} name="country" defaultValue="fr" required />);
    const hidden = container.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hidden.name).toBe("country");
    expect(hidden.value).toBe("fr");
    expect(hidden.required).toBe(true);
  });

  it("the hidden input falls back to an empty string when nothing is selected", () => {
    const container = mount(() => <Combobox options={OPTIONS} name="country" />);
    const hidden = container.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hidden.value).toBe("");
  });

  it("focusing the input opens the listbox and lists options with disabled state", () => {
    const container = mount(() => <Combobox options={OPTIONS} defaultValue="de" />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus"));
    expect(container.querySelector('[role="combobox"]')?.getAttribute("data-open")).toBe("");
    const options = container.querySelectorAll('[role="option"]');
    expect(options).toHaveLength(4);
    expect(options[3].getAttribute("aria-disabled")).toBe("true");
    expect(options[3].getAttribute("data-disabled")).toBe("");
    expect(options[1].getAttribute("data-selected")).toBe(""); // de = Germany
  });

  it("focusing while already open is a no-op", () => {
    const container = mount(() => <Combobox options={OPTIONS} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus"));
    expect(() => { input.dispatchEvent(new FocusEvent("focus")); }).not.toThrow();
  });

  it("focus does nothing while disabled", () => {
    const container = mount(() => <Combobox options={OPTIONS} disabled />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus"));
    expect(container.querySelector('[role="combobox"]')?.hasAttribute("data-open")).toBe(false);
  });

  it("typing filters options, emits onQueryChange, and clears selection when cleared", () => {
    const onQueryChange = vi.fn();
    const onValueChange = vi.fn();
    const container = mount(() => (
      <Combobox options={OPTIONS} defaultValue="fr" onQueryChange={onQueryChange} onValueChange={onValueChange} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    input.value = "ger";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(onQueryChange).toHaveBeenCalledWith("ger");
    expect(container.querySelectorAll('[role="option"]')).toHaveLength(1);

    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(onValueChange).toHaveBeenCalledWith("");
  });

  it("clicking an enabled option selects it and closes the list", () => {
    const onValueChange = vi.fn();
    const container = mount(() => <Combobox options={OPTIONS} onValueChange={onValueChange} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus"));
    const options = container.querySelectorAll('[role="option"]');
    (options[0] as HTMLElement).click();
    expect(onValueChange).toHaveBeenCalledWith("fr");
    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });

  it("in controlled mode (value set), selecting an option does not update internal state but still emits", () => {
    const onValueChange = vi.fn();
    const container = mount(() => (
      <Combobox options={OPTIONS} value="fr" onValueChange={onValueChange} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus"));
    const options = container.querySelectorAll('[role="option"]');
    (options[1] as HTMLElement).click();
    expect(onValueChange).toHaveBeenCalledWith("de");
    const hidden = container.querySelector('input[type="hidden"]');
    expect(hidden).toBeNull();
  });

  it("clicking a disabled option does nothing", () => {
    const onValueChange = vi.fn();
    const container = mount(() => <Combobox options={OPTIONS} onValueChange={onValueChange} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus"));
    const options = container.querySelectorAll('[role="option"]');
    (options[3] as HTMLElement).click();
    expect(onValueChange).not.toHaveBeenCalled();
    expect(container.querySelector('[role="listbox"]')).toBeTruthy();
  });

  it("clicking a stray <li> with an invalid data-index is a no-op (defensive bounds checks)", () => {
    const onValueChange = vi.fn();
    const container = mount(() => <Combobox options={OPTIONS} onValueChange={onValueChange} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus"));
    const root = container.querySelector('[role="combobox"]') as HTMLElement;

    const stray = document.createElement("li");
    stray.setAttribute("data-index", "not-a-number");
    root.appendChild(stray);
    stray.click();
    expect(onValueChange).not.toHaveBeenCalled();

    stray.setAttribute("data-index", "-1");
    stray.click();
    expect(onValueChange).not.toHaveBeenCalled();

    stray.setAttribute("data-index", "999");
    stray.click();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("clicking a stray <li> with no data-index attribute is a no-op (?? fallback)", () => {
    const onValueChange = vi.fn();
    const container = mount(() => <Combobox options={OPTIONS} onValueChange={onValueChange} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus"));
    const root = container.querySelector('[role="combobox"]') as HTMLElement;

    const stray = document.createElement("li");
    root.appendChild(stray);
    stray.click();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("clicking the root while closed, or directly on the root while open (no li ancestor), is a no-op", () => {
    const onValueChange = vi.fn();
    const container = mount(() => <Combobox options={OPTIONS} onValueChange={onValueChange} />);
    const input = container.querySelector("input") as HTMLInputElement;
    const root = container.querySelector('[role="combobox"]') as HTMLElement;
    expect(() => { root.click(); }).not.toThrow();

    input.dispatchEvent(new FocusEvent("focus"));
    expect(() => { root.click(); }).not.toThrow();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("ArrowDown opens when closed and navigates with wraparound when open", () => {
    const container = mount(() => <Combobox options={OPTIONS} />);
    const input = container.querySelector("input") as HTMLInputElement;
    const down = () => input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    down();
    let options = container.querySelectorAll('[role="option"]');
    expect(options[0].getAttribute("data-active")).toBe("");
    down();
    down();
    down();
    options = container.querySelectorAll('[role="option"]');
    expect(options[3].getAttribute("data-active")).toBe("");
    down(); // wraps
    options = container.querySelectorAll('[role="option"]');
    expect(options[0].getAttribute("data-active")).toBe("");
  });

  it("ArrowUp opens (highlighting the last option) when closed, and navigates backward when open", () => {
    const container = mount(() => <Combobox options={OPTIONS} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true, cancelable: true }));
    let options = container.querySelectorAll('[role="option"]');
    expect(options[3].getAttribute("data-active")).toBe("");
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true, cancelable: true }));
    options = container.querySelectorAll('[role="option"]');
    expect(options[2].getAttribute("data-active")).toBe("");
  });

  it("ArrowUp wraps from index 0 to the last option when open", () => {
    const container = mount(() => <Combobox options={OPTIONS} />);
    const input = container.querySelector("input") as HTMLInputElement;
    // Open with the first option active (no selected value -> _open_ falls back to index 0).
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true, cancelable: true }));
    const options = container.querySelectorAll('[role="option"]');
    expect(options[3].getAttribute("data-active")).toBe("");
  });

  it("Enter selects the active option", () => {
    const onValueChange = vi.fn();
    const container = mount(() => <Combobox options={OPTIONS} onValueChange={onValueChange} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    expect(onValueChange).toHaveBeenCalledWith("fr");
  });

  it("Enter does nothing while closed", () => {
    const onValueChange = vi.fn();
    const container = mount(() => <Combobox options={OPTIONS} onValueChange={onValueChange} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("Escape and Tab close the list", () => {
    const container = mount(() => <Combobox options={OPTIONS} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(container.querySelector('[role="listbox"]')).toBeNull();

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }));
    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });

  it("other keys do not throw", () => {
    const container = mount(() => <Combobox options={OPTIONS} />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(() => {
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true }));
    }).not.toThrow();
  });

  it("blurring to an unrelated element closes the list; blurring to the listbox keeps it open", () => {
    const container = mount(() => <Combobox options={OPTIONS} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    const listbox = container.querySelector('[role="listbox"]') as HTMLElement;
    input.dispatchEvent(new FocusEvent("blur", { relatedTarget: listbox }));
    expect(container.querySelector('[role="listbox"]')).toBeTruthy();

    const outside = document.createElement("button");
    document.body.appendChild(outside);
    input.dispatchEvent(new FocusEvent("blur", { relatedTarget: outside }));
    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });

  it("uses a custom filterFn", () => {
    const filterFn = vi.fn((o: ComboboxOption, q: string) => o.value.startsWith(q));
    const container = mount(() => <Combobox options={OPTIONS} filterFn={filterFn} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.value = "f";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(filterFn).toHaveBeenCalled();
    expect(container.querySelectorAll('[role="option"]')).toHaveLength(1);
  });

  it("defaultValue displays its matching label as the initial query, not blank", () => {
    const container = mount(() => <Combobox options={OPTIONS} defaultValue="de" />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.value).toBe("Germany");
  });

  it("selecting an option via Enter, then blurring away, keeps the selected label displayed", () => {
    const container = mount(() => <Combobox options={OPTIONS} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    expect(input.value).toBe("Germany");

    const outside = document.createElement("button");
    document.body.appendChild(outside);
    input.dispatchEvent(new FocusEvent("blur", { relatedTarget: outside }));
    expect(input.value).toBe("Germany");
  });

  it("clicking an option, then blurring away, keeps the selected label displayed", () => {
    const container = mount(() => <Combobox options={OPTIONS} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus"));
    const options = container.querySelectorAll('[role="option"]');
    (options[0] as HTMLElement).click();
    expect(input.value).toBe("France");

    const outside = document.createElement("button");
    document.body.appendChild(outside);
    input.dispatchEvent(new FocusEvent("blur", { relatedTarget: outside }));
    expect(input.value).toBe("France");
  });

  it("re-focusing after a selection shows the full option list again instead of filtering by the displayed label", () => {
    const container = mount(() => <Combobox options={OPTIONS} defaultValue="de" />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus"));
    expect(container.querySelectorAll('[role="option"]')).toHaveLength(4);
  });

  it("typing after a selection is not clobbered by the listbox opening", () => {
    const container = mount(() => <Combobox options={OPTIONS} defaultValue="de" />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.value = "jap";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(input.value).toBe("jap");
    expect(container.querySelectorAll('[role="option"]')).toHaveLength(1);
  });

  it("Escape after typing without selecting reverts the query to the current selection's label", () => {
    const container = mount(() => <Combobox options={OPTIONS} defaultValue="de" />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.value = "jap";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(input.value).toBe("Germany");
  });
});
