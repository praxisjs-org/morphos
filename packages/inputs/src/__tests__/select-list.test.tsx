// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { setReactiveObserver, signal } from "@praxisjs/core/internal";
import { render } from "@praxisjs/runtime";

import { Select } from "../select/select";
import type { SelectOption } from "../select/select.types";

const OPTIONS: SelectOption[] = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
  { value: "c", label: "Cherry" },
];

function makeOptions(count: number): SelectOption[] {
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

function elementsChangedBy(root: Element, selector: string, fn: () => void): Set<Element> {
  const observer = new MutationObserver(() => undefined);
  observer.observe(root, { attributes: true, subtree: true });
  fn();
  const changed = new Set(observer.takeRecords().map((r) => (r.target as Element).closest(selector)));
  observer.disconnect();
  changed.delete(null);
  return changed as Set<Element>;
}

function open(container: Element): HTMLElement {
  (container.querySelector('[role="combobox"]') as HTMLButtonElement).click();
  return container.querySelector('[role="listbox"]') as HTMLElement;
}

function key(el: Element, name: string) {
  el.dispatchEvent(new KeyboardEvent("keydown", { key: name, bubbles: true }));
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Select keyed options", () => {
  it("moving the active option updates only the previous and next option", () => {
    const container = mount(() => <Select options={makeOptions(50)} />);
    const listbox = open(container);
    const rows = [...listbox.querySelectorAll("li")];

    const changed = elementsChangedBy(listbox, "li", () => { key(listbox, "ArrowDown"); });
    expect(changed).toEqual(new Set([rows[0], rows[1]]));
    expect(rows[1].getAttribute("data-active")).toBe("");
  });

  it("runs the same number of effects per arrow key for 5 or 50 options", () => {
    const runsFor = (count: number) => {
      const listbox = open(mount(() => <Select options={makeOptions(count)} />));
      return countEffects(() => { key(listbox, "ArrowDown"); });
    };
    const small = runsFor(5);
    expect(runsFor(50)).toBe(small);
    expect(small).toBeLessThanOrEqual(3);
  });

  it("keeps rows of both lists when options change, adding only the new ones", () => {
    const options = signal<SelectOption[]>(OPTIONS);
    const container = mount(() => <Select options={() => options()} name="fruit" defaultValue="b" />);
    const listbox = open(container);
    const native = container.querySelector("select") as HTMLSelectElement;
    const rows = [...listbox.querySelectorAll("li")];
    const nativeOptions = [...native.options];

    options.set([...OPTIONS.slice(1), { value: "d", label: "Date" }]);

    const nextRows = [...listbox.querySelectorAll("li")];
    expect(nextRows.map((li) => li.textContent)).toEqual(["Banana", "Cherry", "Date"]);
    expect(nextRows.slice(0, 2)).toEqual(rows.slice(1));
    const nextNative = [...native.options];
    expect(nextNative.map((o) => o.value)).toEqual(["b", "c", "d"]);
    expect(nextNative.slice(0, 2)).toEqual(nativeOptions.slice(1));
    expect(native.value).toBe("b");
  });

  it("selects the clicked option's current item after it was replaced under the same value", () => {
    const options = signal<SelectOption[]>(OPTIONS);
    const values: string[] = [];
    const container = mount(() => (
      <Select options={() => options()} onValueChange={(v: string) => { values.push(v); }} />
    ));
    const listbox = open(container);
    const banana = listbox.querySelectorAll("li")[1] as HTMLElement;

    options.set(OPTIONS.map((o) => (o.value === "b" ? { ...o, label: "Plantain", disabled: true } : o)));
    expect(listbox.querySelectorAll("li")[1]).toBe(banana);
    expect(banana.textContent).toBe("Plantain");
    expect(banana.getAttribute("aria-disabled")).toBe("true");
    expect(banana.getAttribute("data-disabled")).toBe("");
    banana.click();
    expect(values).toEqual([]);

    options.set(OPTIONS);
    banana.click();
    expect(values).toEqual(["b"]);
  });

  it("a controlled value change updates only the previous and next option of each list", () => {
    const value = signal<string | undefined>("a");
    const container = mount(() => <Select options={OPTIONS} name="fruit" value={() => value()} />);
    const listbox = open(container);
    const native = container.querySelector("select") as HTMLSelectElement;
    const rows = [...listbox.querySelectorAll("li")];

    const changed = elementsChangedBy(listbox, "li", () => { value.set("c"); });
    expect(changed).toEqual(new Set([rows[0], rows[2]]));
    expect(rows[2].getAttribute("aria-selected")).toBe("true");
    expect(rows[0].getAttribute("aria-selected")).toBe("false");
    expect(native.value).toBe("c");
    expect(native.options[2].selected).toBe(true);
  });
});
