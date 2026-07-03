// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@praxisjs/runtime";

import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../context-menu/context-menu";

afterEach(() => {
  document.body.innerHTML = "";
});

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  render(node as () => Node, container);
  return container;
}

describe("ContextMenu", () => {
  it("starts closed at position (0,0)", () => {
    const menu = new ContextMenu();
    menu.onBeforeMount?.();
    expect(menu.isOpen).toBe(false);
  });

  it("open/close manage state and fire onOpenChange", () => {
    const onOpenChange = vi.fn();
    const menu = new ContextMenu({ onOpenChange });
    menu.onBeforeMount?.();
    menu.open();
    expect(menu.isOpen).toBe(true);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    menu.close();
    expect(menu.isOpen).toBe(false);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("setPosition updates x/y", () => {
    const menu = new ContextMenu();
    menu.onBeforeMount?.();
    menu.setPosition(10, 20);
    expect(menu._x).toBe(10);
    expect(menu._y).toBe(20);
  });

  it("renders its children when used as a JSX wrapper", () => {
    const container = mount(() => (
      <ContextMenu>
        <span>wrapped</span>
      </ContextMenu>
    ));
    expect(container.textContent).toBe("wrapped");
  });
});

describe("ContextMenuTrigger", () => {
  it("opens the menu at the cursor position on contextmenu, prevents default", () => {
    const menu = new ContextMenu();
    menu.onBeforeMount?.();
    const container = mount(() => (
      <ContextMenuTrigger contextMenu={menu} id="trig" class="t">
        area
      </ContextMenuTrigger>
    ));
    const trigger = container.querySelector("#trig") as HTMLElement;
    expect(trigger.className).toBe("t");
    expect(trigger.hasAttribute("data-open")).toBe(false);

    const event = new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 42, clientY: 84 });
    const prevented = !trigger.dispatchEvent(event);
    expect(prevented).toBe(true);
    expect(menu.isOpen).toBe(true);
    expect(menu._x).toBe(42);
    expect(menu._y).toBe(84);
    expect(trigger.getAttribute("data-open")).toBe("");
  });
});

describe("ContextMenuContent", () => {
  it("renders nothing while closed", () => {
    const menu = new ContextMenu();
    menu.onBeforeMount?.();
    mount(() => <ContextMenuContent contextMenu={menu}>x</ContextMenuContent>);
    expect(document.querySelector('[role="menu"]')).toBeNull();
  });

  it("portals a positioned menu into document.body when open", () => {
    const menu = new ContextMenu();
    menu.onBeforeMount?.();
    menu.setPosition(15, 30);
    mount(() => (
      <ContextMenuContent contextMenu={menu} id="cm-1" class="c" aria-label="al">
        <li>item</li>
      </ContextMenuContent>
    ));
    menu.open();
    const list = document.querySelector('[role="menu"]') as HTMLElement;
    expect(list.id).toBe("cm-1");
    expect(list.className).toBe("c");
    expect(list.getAttribute("aria-label")).toBe("al");
    expect(list.getAttribute("data-open")).toBe("");
    expect(list.style.position).toBe("fixed");
    expect(list.style.left).toBe("15px");
    expect(list.style.top).toBe("30px");
  });

  it("closes on outside click, ignores clicks inside the menu", async () => {
    const menu = new ContextMenu();
    menu.onBeforeMount?.();
    mount(() => (
      <ContextMenuContent contextMenu={menu}>
        <li>item</li>
      </ContextMenuContent>
    ));
    menu.open();
    await Promise.resolve();
    const list = document.querySelector('[role="menu"]') as HTMLElement;
    const item = list.querySelector("li") as HTMLElement;

    item.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(menu.isOpen).toBe(true);

    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(menu.isOpen).toBe(false);
  });

  it("outside click handler is a no-op while the menu is already closed", async () => {
    const menu = new ContextMenu();
    menu.onBeforeMount?.();
    mount(() => <ContextMenuContent contextMenu={menu} />);
    await Promise.resolve();
    expect(() => {
      document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    }).not.toThrow();
    expect(menu.isOpen).toBe(false);
  });

  it("Escape closes the menu regardless of focus", async () => {
    const menu = new ContextMenu();
    menu.onBeforeMount?.();
    mount(() => <ContextMenuContent contextMenu={menu} />);
    menu.open();
    await Promise.resolve();
    document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(menu.isOpen).toBe(false);
  });

  it("Escape does nothing while already closed; other keys do nothing while open", async () => {
    const menu = new ContextMenu();
    menu.onBeforeMount?.();
    mount(() => <ContextMenuContent contextMenu={menu} />);
    await Promise.resolve();
    document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(menu.isOpen).toBe(false);

    menu.open();
    document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true }));
    expect(menu.isOpen).toBe(true);
  });

  it("unmount removes document listeners without throwing", async () => {
    const menu = new ContextMenu();
    menu.onBeforeMount?.();
    const container = document.createElement("div");
    document.body.appendChild(container);
    const dispose = render(() => <ContextMenuContent contextMenu={menu} />, container);
    await Promise.resolve();
    expect(() => { dispose(); }).not.toThrow();
  });
});

describe("ContextMenuItem", () => {
  it("renders role=menuitem with label, calls onSelect and closes the menu when clicked", () => {
    const menu = new ContextMenu();
    menu.onBeforeMount?.();
    menu.open();
    const onSelect = vi.fn();
    const container = mount(() => (
      <ContextMenuItem contextMenu={menu} value="a" label="Copy" id="i1" class="mi" onSelect={onSelect} />
    ));
    const li = container.querySelector("li") as HTMLLIElement;
    expect(li.id).toBe("i1");
    expect(li.className).toBe("mi");
    expect(li.tabIndex).toBe(0);
    expect(li.hasAttribute("data-disabled")).toBe(false);
    expect(li.textContent).toBe("Copy");
    li.click();
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(menu.isOpen).toBe(false);
  });

  it("prefers children over the label prop", () => {
    const menu = new ContextMenu();
    menu.onBeforeMount?.();
    const container = mount(() => (
      <ContextMenuItem contextMenu={menu} value="a" label="Copy">
        <strong>Custom</strong>
      </ContextMenuItem>
    ));
    expect(container.querySelector("li")?.textContent).toBe("Custom");
  });

  it("disabled items do not select on click and expose data-disabled/tabIndex -1", () => {
    const menu = new ContextMenu();
    menu.onBeforeMount?.();
    const onSelect = vi.fn();
    const container = mount(() => (
      <ContextMenuItem contextMenu={menu} value="a" disabled onSelect={onSelect}>
        Item
      </ContextMenuItem>
    ));
    const li = container.querySelector("li") as HTMLLIElement;
    expect(li.tabIndex).toBe(-1);
    expect(li.getAttribute("aria-disabled")).toBe("true");
    expect(li.getAttribute("data-disabled")).toBe("");
    li.click();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("Enter and Space select the item; other keys do nothing", () => {
    const menu = new ContextMenu();
    menu.onBeforeMount?.();
    const onSelect = vi.fn();
    const container = mount(() => (
      <ContextMenuItem contextMenu={menu} value="a" onSelect={onSelect}>
        Item
      </ContextMenuItem>
    ));
    const li = container.querySelector("li") as HTMLLIElement;

    li.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    expect(onSelect).toHaveBeenCalledTimes(1);

    li.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true }));
    expect(onSelect).toHaveBeenCalledTimes(2);

    li.dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true }));
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it("works without an onSelect prop", () => {
    const menu = new ContextMenu();
    menu.onBeforeMount?.();
    const container = mount(() => (
      <ContextMenuItem contextMenu={menu} value="a">Item</ContextMenuItem>
    ));
    const li = container.querySelector("li") as HTMLLIElement;
    expect(() => { li.click(); }).not.toThrow();
  });
});
