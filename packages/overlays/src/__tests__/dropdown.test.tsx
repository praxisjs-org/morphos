// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@praxisjs/runtime";

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "../dropdown/dropdown";

afterEach(() => {
  document.body.innerHTML = "";
});

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  render(node as () => Node, container);
  return container;
}

function makeTrigger(rect: Partial<DOMRect>): HTMLElement {
  const el = document.createElement("button");
  el.getBoundingClientRect = () => ({
    top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => "",
    ...rect,
  });
  return el;
}

describe("Dropdown", () => {
  it("renders its children when used as a JSX wrapper", () => {
    const container = mount(() => (
      <Dropdown>
        <span>wrapped</span>
      </Dropdown>
    ));
    expect(container.textContent).toBe("wrapped");
  });

  it("openDropdown/closeDropdown in controlled mode emit without changing internal state", () => {
    const onOpenChange = vi.fn();
    const dd = new Dropdown({ open: false, onOpenChange });
    dd.onBeforeMount?.();
    dd.openDropdown();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(dd.isOpen).toBe(false);

    const dd2 = new Dropdown({ open: true, onOpenChange });
    dd2.onBeforeMount?.();
    dd2.closeDropdown();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(dd2.isOpen).toBe(true);
  });

  it("handleKeyDown is a no-op while closed", () => {
    const dd = new Dropdown();
    dd.onBeforeMount?.();
    expect(() => {
      dd.handleKeyDown(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    }).not.toThrow();
    expect(dd._activeIndex).toBe(-1);
  });

  it("handleKeyDown navigates and wraps with ArrowDown/ArrowUp, and focuses the active item", () => {
    const dd = new Dropdown({ defaultOpen: true });
    dd.onBeforeMount?.();
    const a = document.createElement("li");
    const b = document.createElement("li");
    a.tabIndex = -1;
    b.tabIndex = -1;
    document.body.append(a, b);
    dd._items.push(a, b);
    dd._activeIndex = 0;

    dd.handleKeyDown(new KeyboardEvent("keydown", { key: "ArrowDown", cancelable: true }));
    expect(dd._activeIndex).toBe(1);
    expect(document.activeElement).toBe(b);

    dd.handleKeyDown(new KeyboardEvent("keydown", { key: "ArrowDown", cancelable: true }));
    expect(dd._activeIndex).toBe(0);
    expect(document.activeElement).toBe(a);

    dd.handleKeyDown(new KeyboardEvent("keydown", { key: "ArrowUp", cancelable: true }));
    expect(dd._activeIndex).toBe(1);
    expect(document.activeElement).toBe(b);
  });

  it("Home/End jump to the first/last item", () => {
    const dd = new Dropdown({ defaultOpen: true });
    dd.onBeforeMount?.();
    const a = document.createElement("li");
    const b = document.createElement("li");
    const c = document.createElement("li");
    a.tabIndex = -1;
    b.tabIndex = -1;
    c.tabIndex = -1;
    document.body.append(a, b, c);
    dd._items.push(a, b, c);

    dd.handleKeyDown(new KeyboardEvent("keydown", { key: "End", cancelable: true }));
    expect(dd._activeIndex).toBe(2);
    expect(document.activeElement).toBe(c);

    dd.handleKeyDown(new KeyboardEvent("keydown", { key: "Home", cancelable: true }));
    expect(dd._activeIndex).toBe(0);
    expect(document.activeElement).toBe(a);
  });

  it("Escape and Tab close the dropdown", () => {
    const dd = new Dropdown({ defaultOpen: true });
    dd.onBeforeMount?.();
    dd.handleKeyDown(new KeyboardEvent("keydown", { key: "Escape", cancelable: true }));
    expect(dd.isOpen).toBe(false);

    dd.openDropdown();
    dd.handleKeyDown(new KeyboardEvent("keydown", { key: "Tab", cancelable: true }));
    expect(dd.isOpen).toBe(false);
  });

  it("other keys are ignored while open", () => {
    const dd = new Dropdown({ defaultOpen: true });
    dd.onBeforeMount?.();
    dd.handleKeyDown(new KeyboardEvent("keydown", { key: "x", cancelable: true }));
    expect(dd.isOpen).toBe(true);
  });
});

describe("DropdownTrigger", () => {
  it("renders attributes, registers itself with the dropdown, and toggles on click", async () => {
    const dropdown = new Dropdown();
    dropdown.onBeforeMount?.();
    const container = mount(() => (
      <DropdownTrigger dropdown={dropdown} id="trig" class="tc" aria-label="al">
        Open
      </DropdownTrigger>
    ));
    const btn = container.querySelector("#trig") as HTMLButtonElement;
    expect(btn.className).toBe("tc");
    expect(btn.getAttribute("aria-haspopup")).toBe("menu");
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    expect(btn.getAttribute("aria-controls")).toBe(dropdown.menuId);
    expect(btn.getAttribute("aria-label")).toBe("al");
    expect(btn.hasAttribute("data-open")).toBe(false);

    btn.click();
    expect(dropdown.isOpen).toBe(true);
    expect(btn.getAttribute("aria-expanded")).toBe("true");
    expect(btn.getAttribute("data-open")).toBe("");

    await Promise.resolve();
    expect((dropdown as unknown as { _triggerEl: HTMLElement | null })._triggerEl).toBe(btn);

    btn.click();
    expect(dropdown.isOpen).toBe(false);
  });

  it("falls back to dropdown.triggerId when no id is given", () => {
    const dropdown = new Dropdown();
    dropdown.onBeforeMount?.();
    const container = mount(() => <DropdownTrigger dropdown={dropdown}>Open</DropdownTrigger>);
    const btn = container.querySelector("button") as HTMLButtonElement;
    expect(btn.id).toBe(dropdown.triggerId);
  });
});

describe("DropdownMenu", () => {
  it("renders nothing while closed", () => {
    const dropdown = new Dropdown();
    dropdown.onBeforeMount?.();
    mount(() => <DropdownMenu dropdown={dropdown}>x</DropdownMenu>);
    expect(document.querySelector('[role="menu"]')).toBeNull();
  });

  it("portals a positioned menu into document.body when open", () => {
    const dropdown = new Dropdown();
    dropdown.onBeforeMount?.();
    dropdown._registerTrigger(makeTrigger({ top: 20, left: 30, right: 130, bottom: 40 }));
    mount(() => (
      <DropdownMenu dropdown={dropdown} id="menu-1" class="mc" aria-label="al">
        <li>item</li>
      </DropdownMenu>
    ));
    dropdown.openDropdown();

    const list = document.querySelector('[role="menu"]') as HTMLElement;
    expect(list.id).toBe("menu-1");
    expect(list.className).toBe("mc");
    expect(list.getAttribute("aria-label")).toBe("al");
    expect(list.getAttribute("data-open")).toBe("");
    expect(list.parentElement?.style.position).toBe("fixed");
  });

  it("falls back to dropdown.menuId and aria-labelledby=triggerId when unset", () => {
    const dropdown = new Dropdown();
    dropdown.onBeforeMount?.();
    mount(() => <DropdownMenu dropdown={dropdown} />);
    dropdown.openDropdown();
    const list = document.querySelector('[role="menu"]') as HTMLElement;
    expect(list.id).toBe(dropdown.menuId);
    expect(list.getAttribute("aria-labelledby")).toBe(dropdown.triggerId);
  });

  it("uses a neutral position when the dropdown has no computed position", () => {
    const dropdown = new Dropdown();
    dropdown.onBeforeMount?.();
    mount(() => <DropdownMenu dropdown={dropdown} />);
    dropdown.openDropdown();
    const list = document.querySelector('[role="menu"]') as HTMLElement;
    const wrapper = list.parentElement as HTMLElement;
    expect(wrapper.style.top).toBe("0px");
    expect(wrapper.style.left).toBe("0px");
    expect(wrapper.style.transform).toBe("none");
  });

  it("keydown on the menu delegates to dropdown.handleKeyDown", () => {
    const dropdown = new Dropdown();
    dropdown.onBeforeMount?.();
    mount(() => <DropdownMenu dropdown={dropdown} />);
    dropdown.openDropdown();
    const list = document.querySelector('[role="menu"]') as HTMLElement;
    list.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(dropdown.isOpen).toBe(false);
  });
});

describe("DropdownItem", () => {
  it("registers itself on mount and unregisters on unmount", async () => {
    const dropdown = new Dropdown();
    dropdown.onBeforeMount?.();
    const container = document.createElement("div");
    document.body.appendChild(container);
    const dispose = render(() => <DropdownItem dropdown={dropdown} value="a" label="A" />, container);
    await Promise.resolve();
    expect(dropdown._items).toHaveLength(1);
    dispose();
    expect(dropdown._items).toHaveLength(0);
  });

  it("onMount/onUnmount are no-ops when the ref never resolved (defensive branches)", () => {
    const dropdown = new Dropdown();
    dropdown.onBeforeMount?.();
    const item = new DropdownItem({ dropdown, value: "a" });
    expect(() => { item.onMount?.(); }).not.toThrow();
    expect(dropdown._items).toHaveLength(0);
    expect(() => { item.onUnmount?.(); }).not.toThrow();
  });

  it("onUnmount is a no-op when the item was already removed from the dropdown's list", async () => {
    const dropdown = new Dropdown();
    dropdown.onBeforeMount?.();
    const container = document.createElement("div");
    document.body.appendChild(container);
    const dispose = render(() => <DropdownItem dropdown={dropdown} value="a" label="A" />, container);
    await Promise.resolve();
    expect(dropdown._items).toHaveLength(1);
    dropdown._items.length = 0;
    expect(() => { dispose(); }).not.toThrow();
  });

  it("renders label when no children are given, with tabIndex 0 when enabled", () => {
    const dropdown = new Dropdown();
    dropdown.onBeforeMount?.();
    const container = mount(() => <DropdownItem dropdown={dropdown} value="a" label="Item A" id="i-a" class="ic" />);
    const li = container.querySelector("#i-a") as HTMLLIElement;
    expect(li.className).toBe("ic");
    expect(li.getAttribute("role")).toBe("menuitem");
    expect(li.tabIndex).toBe(0);
    expect(li.hasAttribute("aria-disabled")).toBe(false);
    expect(li.hasAttribute("data-disabled")).toBe(false);
    expect(li.textContent).toBe("Item A");
  });

  it("prefers children over label", () => {
    const dropdown = new Dropdown();
    dropdown.onBeforeMount?.();
    const container = mount(() => (
      <DropdownItem dropdown={dropdown} value="a" label="Item A">
        <b>Custom</b>
      </DropdownItem>
    ));
    expect(container.textContent).toBe("Custom");
  });

  it("disabled sets tabIndex -1/aria-disabled/data-disabled and blocks selection on click and keydown", () => {
    const onSelect = vi.fn();
    const dropdown = new Dropdown({ defaultOpen: true });
    dropdown.onBeforeMount?.();
    const container = mount(() => (
      <DropdownItem dropdown={dropdown} value="a" disabled onSelect={onSelect} label="X" />
    ));
    const li = container.querySelector("li") as HTMLLIElement;
    expect(li.tabIndex).toBe(-1);
    expect(li.getAttribute("aria-disabled")).toBe("true");
    expect(li.getAttribute("data-disabled")).toBe("");

    li.click();
    expect(onSelect).not.toHaveBeenCalled();
    expect(dropdown.isOpen).toBe(true);

    li.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("clicking an enabled item calls onSelect and closes the dropdown when closeOnSelect is true (default)", () => {
    const onSelect = vi.fn();
    const dropdown = new Dropdown({ defaultOpen: true });
    dropdown.onBeforeMount?.();
    const container = mount(() => <DropdownItem dropdown={dropdown} value="a" onSelect={onSelect} label="X" />);
    const li = container.querySelector("li") as HTMLLIElement;
    li.click();
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(dropdown.isOpen).toBe(false);
  });

  it("does not close the dropdown when closeOnSelect is false", () => {
    const onSelect = vi.fn();
    const dropdown = new Dropdown({ defaultOpen: true, closeOnSelect: false });
    dropdown.onBeforeMount?.();
    const container = mount(() => <DropdownItem dropdown={dropdown} value="a" onSelect={onSelect} label="X" />);
    const li = container.querySelector("li") as HTMLLIElement;
    li.click();
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(dropdown.isOpen).toBe(true);
  });

  it("Enter and Space on the item trigger selection", () => {
    const onSelect = vi.fn();
    const dropdown = new Dropdown({ defaultOpen: true });
    dropdown.onBeforeMount?.();
    const container = mount(() => <DropdownItem dropdown={dropdown} value="a" onSelect={onSelect} label="X" />);
    const li = container.querySelector("li") as HTMLLIElement;

    li.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    expect(onSelect).toHaveBeenCalledTimes(1);

    dropdown.openDropdown();
    li.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true }));
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it("other keys on the item are ignored", () => {
    const onSelect = vi.fn();
    const dropdown = new Dropdown({ defaultOpen: true });
    dropdown.onBeforeMount?.();
    const container = mount(() => <DropdownItem dropdown={dropdown} value="a" onSelect={onSelect} label="X" />);
    const li = container.querySelector("li") as HTMLLIElement;
    li.dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("clicking with no onSelect provided does not throw", () => {
    const dropdown = new Dropdown({ defaultOpen: true });
    dropdown.onBeforeMount?.();
    const container = mount(() => <DropdownItem dropdown={dropdown} value="a" label="X" />);
    const li = container.querySelector("li") as HTMLLIElement;
    expect(() => { li.click(); }).not.toThrow();
    expect(dropdown.isOpen).toBe(false);
  });
});
