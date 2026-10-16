// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { setReactiveObserver, signal } from "@praxisjs/core/internal";
import { render } from "@praxisjs/runtime";

import { Autocomplete } from "../autocomplete/autocomplete";
import type { AutocompleteSuggestion } from "../autocomplete/autocomplete.types";

const SUGGESTIONS: AutocompleteSuggestion[] = [
  { value: "apple" },
  { value: "apricot" },
  { value: "banana" },
  { value: "grape", label: "Grape" },
];

function makeSuggestions(count: number): AutocompleteSuggestion[] {
  return Array.from({ length: count }, (_, i) => ({ value: `item ${String(i)}` }));
}

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  render(node as () => Node, container);
  return container;
}

function countEffects(fn: () => void): number {
  let runs = 0;
  setReactiveObserver({ effect() { runs++; } });
  try {
    fn();
  } finally {
    setReactiveObserver(null);
  }
  return runs;
}

function rowsChangedBy(root: Element, fn: () => void): Set<Element> {
  const observer = new MutationObserver(() => undefined);
  observer.observe(root, { attributes: true, subtree: true });
  fn();
  const changed = new Set(observer.takeRecords().map((r) => (r.target as Element).closest("li")));
  observer.disconnect();
  changed.delete(null);
  return changed as Set<Element>;
}

function rowsByLabel(container: Element): Map<string, Element> {
  return new Map([...container.querySelectorAll('[role="option"]')].map((li) => [li.textContent ?? "", li]));
}

function type(input: HTMLInputElement, text: string) {
  input.value = text;
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function key(el: Element, name: string) {
  el.dispatchEvent(new KeyboardEvent("keydown", { key: name, bubbles: true }));
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Autocomplete keyed suggestions", () => {
  it("keeps suggestion rows by identity and renumbers their ids by position", () => {
    const container = mount(() => <Autocomplete suggestions={SUGGESTIONS} />);
    const input = container.querySelector("input") as HTMLInputElement;
    const listId = input.getAttribute("aria-controls") ?? "";

    type(input, "a");
    const initial = rowsByLabel(container);
    expect([...initial.keys()]).toEqual(["apple", "apricot", "banana", "Grape"]);
    const apricot = initial.get("apricot");
    expect(apricot?.id).toBe(`${listId}-option-1`);

    type(input, "apr");
    expect([...rowsByLabel(container).keys()]).toEqual(["apricot"]);
    expect(rowsByLabel(container).get("apricot")).toBe(apricot);
    expect(apricot?.id).toBe(`${listId}-option-0`);

    type(input, "a");
    expect(rowsByLabel(container).get("apricot")).toBe(apricot);
    expect(apricot?.id).toBe(`${listId}-option-1`);
  });

  it("points aria-activedescendant at the active row after the list narrows", () => {
    const container = mount(() => <Autocomplete suggestions={SUGGESTIONS} />);
    const input = container.querySelector("input") as HTMLInputElement;
    type(input, "ap");
    key(input, "ArrowDown");
    key(input, "ArrowDown");
    const active = container.querySelector("[data-active]");
    expect(active?.textContent).toBe("apricot");
    expect(input.getAttribute("aria-activedescendant")).toBe(active?.id);
    expect(active?.getAttribute("aria-selected")).toBe("true");
  });

  it("selects the clicked suggestion by its current position after a filter change", () => {
    const selected: AutocompleteSuggestion[] = [];
    const container = mount(() => (
      <Autocomplete suggestions={SUGGESTIONS} onSuggestionSelect={(s: AutocompleteSuggestion) => { selected.push(s); }} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    type(input, "a");
    type(input, "gr");
    (rowsByLabel(container).get("Grape") as HTMLElement).click();
    expect(selected).toEqual([SUGGESTIONS[3]]);
    expect(input.value).toBe("Grape");
  });

  it("moving the active suggestion updates only the previous and next row", () => {
    const container = mount(() => <Autocomplete suggestions={makeSuggestions(50)} />);
    const input = container.querySelector("input") as HTMLInputElement;
    type(input, "item");
    key(input, "ArrowDown");
    const listbox = container.querySelector('[role="listbox"]') as HTMLElement;
    const rows = [...listbox.querySelectorAll("li")];

    const changed = rowsChangedBy(listbox, () => { key(input, "ArrowDown"); });
    expect(changed).toEqual(new Set([rows[0], rows[1]]));
    expect(rows[1].getAttribute("aria-selected")).toBe("true");
    expect(rows[0].getAttribute("aria-selected")).toBe("false");
  });

  it("runs the same number of effects per arrow key for 5 or 50 suggestions", () => {
    const runsFor = (count: number) => {
      const container = mount(() => <Autocomplete suggestions={makeSuggestions(count)} />);
      const input = container.querySelector("input") as HTMLInputElement;
      type(input, "item");
      key(input, "ArrowDown");
      return countEffects(() => { key(input, "ArrowDown"); });
    };
    const small = runsFor(5);
    expect(runsFor(50)).toBe(small);
    expect(small).toBeLessThanOrEqual(6);
  });

  it("updates a suggestion replaced under the same value in place", () => {
    const suggestions = signal<AutocompleteSuggestion[]>(SUGGESTIONS);
    const container = mount(() => <Autocomplete suggestions={() => suggestions()} />);
    const input = container.querySelector("input") as HTMLInputElement;
    type(input, "gr");
    const grape = rowsByLabel(container).get("Grape");

    suggestions.set(SUGGESTIONS.map((s) => (s.value === "grape" ? { ...s, label: "Grapes" } : s)));
    expect(rowsByLabel(container).get("Grapes")).toBe(grape);
  });
});
