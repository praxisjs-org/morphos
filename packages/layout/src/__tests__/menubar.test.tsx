// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@praxisjs/runtime";

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from "../menubar/menubar";

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

describe("Menubar render", () => {
  it("renders role=menubar with id, class, aria-label and children", () => {
    const container = mount(() => (
      <Menubar id="mb" class="mc" aria-label="Main">
        <span>child</span>
      </Menubar>
    ));
    const root = container.querySelector('[role="menubar"]') as HTMLElement;
    expect(root.id).toBe("mb");
    expect(root.className).toBe("mc");
    expect(root.getAttribute("aria-label")).toBe("Main");
    expect(root.textContent).toBe("child");
  });
});

describe("MenubarMenu", () => {
  it("renders only its children, with no wrapper element", () => {
    const menubar = new Menubar();
    menubar.onBeforeMount?.();
    const container = mount(() => (
      <MenubarMenu menubar={menubar} value="file">
        <span id="only-child">x</span>
      </MenubarMenu>
    ));
    expect(container.children).toHaveLength(1);
    expect(container.querySelector("#only-child")).toBeTruthy();
  });

  it("_updatePosition is a no-op when no trigger has been registered", () => {
    const menubar = new Menubar();
    const menu = new MenubarMenu({ menubar, value: "file" });
    menu.onBeforeMount?.();
    menu._updatePosition();
    expect(menu._position).toBeNull();
  });

  it("_updatePosition computes a position once a trigger is registered", () => {
    const menubar = new Menubar();
    const menu = new MenubarMenu({ menubar, value: "file" });
    menu.onBeforeMount?.();
    menu._registerTrigger(makeTrigger({ top: 10, left: 20, right: 120, bottom: 30 }));
    menu._updatePosition();
    expect(menu._position).not.toBeNull();
  });
});

describe("MenubarTrigger", () => {
  it("renders menuitem attributes and registers itself with the menu on mount", async () => {
    const menubar = new Menubar();
    menubar.onBeforeMount?.();
    const menu = new MenubarMenu({ menubar, value: "file" });
    menu.onBeforeMount?.();
    const container = mount(() => (
      <MenubarTrigger menu={menu} id="trig-1" class="tc">
        File
      </MenubarTrigger>
    ));
    const btn = container.querySelector("#trig-1") as HTMLButtonElement;
    expect(btn.className).toBe("tc");
    expect(btn.type).toBe("button");
    expect(btn.getAttribute("role")).toBe("menuitem");
    expect(btn.getAttribute("aria-haspopup")).toBe("menu");
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    expect(btn.getAttribute("aria-controls")).toBe(menu.contentId);
    expect(btn.textContent).toBe("File");
    await Promise.resolve();
    expect(menu._triggerEl).toBe(btn);
  });

  it("falls back to menu.triggerId when no id is given", () => {
    const menubar = new Menubar();
    menubar.onBeforeMount?.();
    const menu = new MenubarMenu({ menubar, value: "file" });
    menu.onBeforeMount?.();
    const container = mount(() => <MenubarTrigger menu={menu}>File</MenubarTrigger>);
    const btn = container.querySelector("button") as HTMLButtonElement;
    expect(btn.id).toBe(menu.triggerId);
  });

  it("clicking updates the menu position and toggles the menubar's active menu", async () => {
    const menubar = new Menubar();
    menubar.onBeforeMount?.();
    const menu = new MenubarMenu({ menubar, value: "file" });
    menu.onBeforeMount?.();
    const container = mount(() => <MenubarTrigger menu={menu}>File</MenubarTrigger>);
    const btn = container.querySelector("button") as HTMLButtonElement;
    await Promise.resolve();

    btn.click();
    expect(menubar.activeMenu).toBe("file");
    expect(menu._position).not.toBeNull();
    expect(btn.getAttribute("aria-expanded")).toBe("true");

    btn.click();
    expect(menubar.activeMenu).toBeNull();
  });
});

describe("MenubarContent", () => {
  it("renders nothing while closed", () => {
    const menubar = new Menubar();
    menubar.onBeforeMount?.();
    const menu = new MenubarMenu({ menubar, value: "file" });
    menu.onBeforeMount?.();
    mount(() => <MenubarContent menu={menu}>x</MenubarContent>);
    expect(document.querySelector('[role="menu"]')).toBeNull();
  });

  it("portals a positioned menu into document.body when open, and registers the content element", () => {
    const menubar = new Menubar();
    menubar.onBeforeMount?.();
    const menu = new MenubarMenu({ menubar, value: "file" });
    menu.onBeforeMount?.();
    menu._registerTrigger(makeTrigger({ top: 40, left: 60, right: 160, bottom: 60 }));
    menu._updatePosition();

    mount(() => (
      <MenubarContent menu={menu} id="content-1" class="cc">
        <li>item</li>
      </MenubarContent>
    ));
    menubar.open("file");

    const list = document.querySelector('[role="menu"]') as HTMLElement;
    expect(list.id).toBe("content-1");
    expect(list.className).toBe("cc");
    expect(list.getAttribute("aria-labelledby")).toBe(menu.triggerId);
    expect(list.parentElement?.style.position).toBe("fixed");
    expect(menu._contentEl).toBe(list);
  });

  it("falls back to menu.contentId when no id is given", () => {
    const menubar = new Menubar();
    menubar.onBeforeMount?.();
    const menu = new MenubarMenu({ menubar, value: "file" });
    menu.onBeforeMount?.();
    mount(() => <MenubarContent menu={menu} />);
    menubar.open("file");
    const list = document.querySelector('[role="menu"]') as HTMLElement;
    expect(list.id).toBe(menu.contentId);
  });

  it("uses a neutral position and transform when the menu has no computed position", () => {
    const menubar = new Menubar();
    menubar.onBeforeMount?.();
    const menu = new MenubarMenu({ menubar, value: "file" });
    menu.onBeforeMount?.();
    mount(() => <MenubarContent menu={menu} />);
    menubar.open("file");
    const list = document.querySelector('[role="menu"]') as HTMLElement;
    const wrapper = list.parentElement as HTMLElement;
    expect(wrapper.style.top).toBe("0px");
    expect(wrapper.style.left).toBe("0px");
    expect(wrapper.style.transform).toBe("none");
  });

  it("real trigger+content composition: clicking the trigger opens it, and mousedown on the trigger does not close it", async () => {
    const menubar = new Menubar({ "aria-label": "App" });
    menubar.onBeforeMount?.();
    const menu = new MenubarMenu({ menubar, value: "file" });
    menu.onBeforeMount?.();

    const container = mount(() => (
      <>
        <MenubarTrigger menu={menu}>File</MenubarTrigger>
        <MenubarContent menu={menu}>
          <MenubarItem menu={menu} label="Open" />
        </MenubarContent>
      </>
    ));
    await Promise.resolve();

    const trigger = container.querySelector('[role="menuitem"]') as HTMLElement;
    trigger.click();
    expect(menubar.activeMenu).toBe("file");

    trigger.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(menubar.activeMenu).toBe("file");

    const item = document.querySelector('li[role="menuitem"]') as HTMLElement;
    item.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(menubar.activeMenu).toBe("file");
  });

  it("mousedown outside the trigger and content closes the menu while open", async () => {
    const menubar = new Menubar();
    menubar.onBeforeMount?.();
    const menu = new MenubarMenu({ menubar, value: "file" });
    menu.onBeforeMount?.();
    mount(() => <MenubarContent menu={menu} />);
    await Promise.resolve();
    menubar.open("file");
    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(menubar.activeMenu).toBeNull();
  });

  it("mousedown handler is a no-op while closed", async () => {
    const menubar = new Menubar();
    menubar.onBeforeMount?.();
    const menu = new MenubarMenu({ menubar, value: "file" });
    menu.onBeforeMount?.();
    mount(() => <MenubarContent menu={menu} />);
    await Promise.resolve();
    expect(() => {
      document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    }).not.toThrow();
    expect(menubar.activeMenu).toBeNull();
  });

  it("Escape closes the menu while open; other keys and closed state are no-ops", async () => {
    const menubar = new Menubar();
    menubar.onBeforeMount?.();
    const menu = new MenubarMenu({ menubar, value: "file" });
    menu.onBeforeMount?.();
    mount(() => <MenubarContent menu={menu} />);
    await Promise.resolve();

    document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(menubar.activeMenu).toBeNull();

    menubar.open("file");
    document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true }));
    expect(menubar.activeMenu).toBe("file");

    document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(menubar.activeMenu).toBeNull();
  });

  it("unmount removes both document listeners without throwing", async () => {
    const menubar = new Menubar();
    menubar.onBeforeMount?.();
    const menu = new MenubarMenu({ menubar, value: "file" });
    menu.onBeforeMount?.();
    const container = document.createElement("div");
    document.body.appendChild(container);
    const dispose = render(() => <MenubarContent menu={menu} />, container);
    await Promise.resolve();
    expect(() => { dispose(); }).not.toThrow();
    expect(() => {
      document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    }).not.toThrow();
  });
});

describe("MenubarItem", () => {
  it("renders label when no children are given, with tabIndex 0 when enabled", () => {
    const menubar = new Menubar();
    menubar.onBeforeMount?.();
    const menu = new MenubarMenu({ menubar, value: "file" });
    menu.onBeforeMount?.();
    const container = mount(() => <MenubarItem menu={menu} label="Open" id="mi-1" class="ic" />);
    const li = container.querySelector("#mi-1") as HTMLLIElement;
    expect(li.className).toBe("ic");
    expect(li.getAttribute("role")).toBe("menuitem");
    expect(li.tabIndex).toBe(0);
    expect(li.hasAttribute("aria-disabled")).toBe(false);
    expect(li.hasAttribute("data-disabled")).toBe(false);
    expect(li.textContent).toBe("Open");
  });

  it("prefers children over label", () => {
    const menubar = new Menubar();
    menubar.onBeforeMount?.();
    const menu = new MenubarMenu({ menubar, value: "file" });
    menu.onBeforeMount?.();
    const container = mount(() => (
      <MenubarItem menu={menu} label="Open">
        <b>Custom</b>
      </MenubarItem>
    ));
    expect(container.textContent).toBe("Custom");
  });

  it("disabled sets tabIndex -1, aria-disabled and data-disabled, and blocks selection", () => {
    const menubar = new Menubar();
    menubar.onBeforeMount?.();
    menubar.open("file");
    const menu = new MenubarMenu({ menubar, value: "file" });
    menu.onBeforeMount?.();
    const onSelect = vi.fn();
    const container = mount(() => <MenubarItem menu={menu} disabled onSelect={onSelect} label="X" />);
    const li = container.querySelector("li") as HTMLLIElement;
    expect(li.tabIndex).toBe(-1);
    expect(li.getAttribute("aria-disabled")).toBe("true");
    expect(li.getAttribute("data-disabled")).toBe("");

    li.click();
    expect(onSelect).not.toHaveBeenCalled();
    expect(menubar.activeMenu).toBe("file");
  });

  it("clicking an enabled item calls onSelect and closes the menubar", () => {
    const menubar = new Menubar();
    menubar.onBeforeMount?.();
    menubar.open("file");
    const menu = new MenubarMenu({ menubar, value: "file" });
    menu.onBeforeMount?.();
    const onSelect = vi.fn();
    const container = mount(() => <MenubarItem menu={menu} onSelect={onSelect} label="X" />);
    const li = container.querySelector("li") as HTMLLIElement;

    li.click();
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(menubar.activeMenu).toBeNull();
  });

  it("clicking with no onSelect provided does not throw", () => {
    const menubar = new Menubar();
    menubar.onBeforeMount?.();
    menubar.open("file");
    const menu = new MenubarMenu({ menubar, value: "file" });
    menu.onBeforeMount?.();
    const container = mount(() => <MenubarItem menu={menu} label="X" />);
    const li = container.querySelector("li") as HTMLLIElement;
    expect(() => { li.click(); }).not.toThrow();
    expect(menubar.activeMenu).toBeNull();
  });
});

describe("MenubarSeparator", () => {
  it("renders a role=separator <li> with id and class", () => {
    const container = mount(() => <MenubarSeparator id="sep-1" class="sc" />);
    const li = container.querySelector("#sep-1") as HTMLLIElement;
    expect(li.className).toBe("sc");
    expect(li.getAttribute("role")).toBe("separator");
  });
});
