// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { setReactiveObserver, signal } from "@praxisjs/core/internal";
import { render } from "@praxisjs/runtime";

import { Combobox } from "../combobox/combobox";
import type { ComboboxOption } from "../combobox/combobox.types";

const OPTIONS: ComboboxOption[] = [
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
  { value: "jp", label: "Japan" },
  { value: "pt", label: "Portugal" },
];

function makeOptions(count: number): ComboboxOption[] {
  return Array.from({ length: count }, (_, i) => ({ value: `v${String(i)}`, label: `Option ${String(i)}` }));
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

describe("Combobox keyed options", () => {
  it("keeps option rows by identity while the filter narrows and widens", () => {
    const container = mount(() => <Combobox options={OPTIONS} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus"));
    const initial = rowsByLabel(container);

    type(input, "a");
    const narrowed = rowsByLabel(container);
    expect([...narrowed.keys()]).toEqual(["France", "Germany", "Japan", "Portugal"]);
    for (const [label, li] of narrowed) expect(li).toBe(initial.get(label));

    type(input, "ja");
    const japan = rowsByLabel(container).get("Japan");
    expect([...rowsByLabel(container).keys()]).toEqual(["Japan"]);
    expect(japan).toBe(initial.get("Japan"));
    expect(japan?.getAttribute("data-index")).toBe("0");

    type(input, "a");
    expect(rowsByLabel(container).get("Japan")).toBe(japan);
    expect(japan?.getAttribute("data-index")).toBe("2");
  });

  it("selects the clicked option by its current position after a filter change", () => {
    const values: string[] = [];
    const container = mount(() => <Combobox options={OPTIONS} onValueChange={(v: string) => { values.push(v); }} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus"));
    type(input, "port");
    (rowsByLabel(container).get("Portugal") as HTMLElement).click();
    expect(values).toEqual(["pt"]);
    expect(input.value).toBe("Portugal");
  });

  it("moving the active option updates only the previous and next option", () => {
    const container = mount(() => <Combobox options={makeOptions(50)} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus"));
    const listbox = container.querySelector('[role="listbox"]') as HTMLElement;
    const rows = [...listbox.querySelectorAll("li")];

    const changed = rowsChangedBy(listbox, () => { key(input, "ArrowDown"); });
    expect(changed).toEqual(new Set([rows[0], rows[1]]));
    expect(rows[1].getAttribute("data-active")).toBe("");
    expect(rows[0].hasAttribute("data-active")).toBe(false);
  });

  it("runs the same number of effects per arrow key for 5 or 50 options", () => {
    const runsFor = (count: number) => {
      const container = mount(() => <Combobox options={makeOptions(count)} />);
      const input = container.querySelector("input") as HTMLInputElement;
      input.dispatchEvent(new FocusEvent("focus"));
      return countEffects(() => { key(input, "ArrowDown"); });
    };
    const small = runsFor(5);
    expect(runsFor(50)).toBe(small);
    expect(small).toBeLessThanOrEqual(3);
  });

  it("a controlled value change updates only the previous and next option", () => {
    const value = signal<string | undefined>("fr");
    const container = mount(() => <Combobox options={OPTIONS} value={() => value()} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus"));
    const listbox = container.querySelector('[role="listbox"]') as HTMLElement;
    const rows = rowsByLabel(container);

    const changed = rowsChangedBy(listbox, () => { value.set("jp"); });
    expect(changed).toEqual(new Set([rows.get("France"), rows.get("Japan")]));
    expect(rows.get("Japan")?.getAttribute("aria-selected")).toBe("true");
    expect(rows.get("Japan")?.getAttribute("data-selected")).toBe("");
    expect(rows.get("France")?.getAttribute("aria-selected")).toBe("false");
    expect(rows.get("France")?.hasAttribute("data-selected")).toBe(false);
  });

  it("updates an option replaced under the same value in place", () => {
    const options = signal<ComboboxOption[]>(OPTIONS);
    const container = mount(() => <Combobox options={() => options()} />);
    const input = container.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus"));
    const germany = rowsByLabel(container).get("Germany");

    options.set(OPTIONS.map((o) => (o.value === "de" ? { ...o, label: "Deutschland", disabled: true } : o)));
    const row = rowsByLabel(container).get("Deutschland");
    expect(row).toBe(germany);
    expect(row?.getAttribute("aria-disabled")).toBe("true");
    expect(row?.getAttribute("data-disabled")).toBe("");
  });
});
