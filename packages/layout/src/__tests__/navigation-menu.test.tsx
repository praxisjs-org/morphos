// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@praxisjs/runtime";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../navigation-menu/navigation-menu";

afterEach(() => {
  document.body.innerHTML = "";
});

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  render(node as () => Node, container);
  return container;
}

describe("NavigationMenu", () => {
  it("renders a nav element with horizontal orientation by default", () => {
    const container = mount(() => (
      <NavigationMenu id="nav-1" class="nm" aria-label="al">
        <div>x</div>
      </NavigationMenu>
    ));
    const nav = container.querySelector("nav");
    expect(nav?.id).toBe("nav-1");
    expect(nav?.className).toBe("nm");
    expect(nav?.getAttribute("aria-label")).toBe("al");
    expect(nav?.getAttribute("data-orientation")).toBe("horizontal");
  });

  it("supports vertical orientation", () => {
    const container = mount(() => <NavigationMenu orientation="vertical" />);
    expect(container.querySelector("nav")?.getAttribute("data-orientation")).toBe("vertical");
  });

  it("open/close/toggle manage the active item", () => {
    const nav = new NavigationMenu();
    nav.onBeforeMount?.();
    expect(nav.activeItem).toBeNull();

    nav.open("a");
    expect(nav.activeItem).toBe("a");

    nav.close();
    expect(nav.activeItem).toBeNull();

    nav.toggle("b");
    expect(nav.activeItem).toBe("b");
    nav.toggle("b");
    expect(nav.activeItem).toBeNull();
    nav.toggle("c");
    nav.toggle("d");
    expect(nav.activeItem).toBe("d");
  });
});

describe("NavigationMenuList", () => {
  it("renders role=list with orientation from the nav", () => {
    const nav = new NavigationMenu({ orientation: "vertical" });
    nav.onBeforeMount?.();
    const container = mount(() => (
      <NavigationMenuList nav={nav} id="list-1" class="l">
        <li>item</li>
      </NavigationMenuList>
    ));
    const list = container.querySelector('[role="list"]');
    expect(list?.id).toBe("list-1");
    expect(list?.className).toBe("l");
    expect(list?.getAttribute("aria-orientation")).toBe("vertical");
  });

  it("defaults to horizontal aria-orientation", () => {
    const nav = new NavigationMenu();
    nav.onBeforeMount?.();
    const container = mount(() => <NavigationMenuList nav={nav} />);
    expect(container.querySelector('[role="list"]')?.getAttribute("aria-orientation")).toBe("horizontal");
  });
});

describe("NavigationMenuItem", () => {
  it("data-active reflects whether it is the nav's active item", () => {
    const nav = new NavigationMenu();
    nav.onBeforeMount?.();
    const container = mount(() => (
      <NavigationMenuItem nav={nav} value="a" id="item-a" class="ia">
        content
      </NavigationMenuItem>
    ));
    const li = container.querySelector("li");
    expect(li?.id).toBe("item-a");
    expect(li?.className).toBe("ia");
    expect(li?.hasAttribute("data-active")).toBe(false);
    nav.open("a");
    expect(li?.getAttribute("data-active")).toBe("");
  });
});

describe("NavigationMenuTrigger", () => {
  it("toggles the nav item on click and reflects aria-expanded", () => {
    const nav = new NavigationMenu();
    nav.onBeforeMount?.();
    const item = new NavigationMenuItem({ nav, value: "a" });
    const container = mount(() => (
      <NavigationMenuTrigger item={item} class="t">
        Menu
      </NavigationMenuTrigger>
    ));
    const button = container.querySelector("button") as HTMLButtonElement;
    expect(button.id).toBe(item.triggerId);
    expect(button.className).toBe("t");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(button.getAttribute("aria-controls")).toBe(item.contentId);
    button.click();
    expect(nav.activeItem).toBe("a");
    expect(button.getAttribute("aria-expanded")).toBe("true");
  });

  it("uses an explicit id when provided", () => {
    const nav = new NavigationMenu();
    nav.onBeforeMount?.();
    const item = new NavigationMenuItem({ nav, value: "a" });
    const container = mount(() => <NavigationMenuTrigger item={item} id="trig-x" />);
    expect(container.querySelector("#trig-x")).toBeTruthy();
  });

  it("registers itself with the item on mount", async () => {
    const nav = new NavigationMenu();
    nav.onBeforeMount?.();
    const item = new NavigationMenuItem({ nav, value: "a" });
    const container = mount(() => <NavigationMenuTrigger item={item}>Menu</NavigationMenuTrigger>);
    await Promise.resolve();
    expect(item._triggerEl).toBe(container.querySelector("button"));
  });
});

describe("NavigationMenuContent", () => {
  it("is hidden until its item is open", () => {
    const nav = new NavigationMenu();
    nav.onBeforeMount?.();
    const item = new NavigationMenuItem({ nav, value: "a" });
    const container = mount(() => (
      <NavigationMenuContent item={item} class="c">
        panel
      </NavigationMenuContent>
    ));
    const div = container.querySelector("div") as HTMLElement;
    expect(div.id).toBe(item.contentId);
    expect(div.className).toBe("c");
    expect(div.hidden).toBe(true);
    nav.open("a");
    expect(div.hidden).toBe(false);
  });

  it("uses an explicit id when provided", () => {
    const nav = new NavigationMenu();
    nav.onBeforeMount?.();
    const item = new NavigationMenuItem({ nav, value: "a" });
    const container = mount(() => <NavigationMenuContent item={item} id="content-x" />);
    expect(container.querySelector("#content-x")).toBeTruthy();
  });

  it("Escape closes the active item's menu", async () => {
    const nav = new NavigationMenu();
    nav.onBeforeMount?.();
    const item = new NavigationMenuItem({ nav, value: "a" });
    mount(() => <NavigationMenuContent item={item}>panel</NavigationMenuContent>);
    await Promise.resolve();
    nav.open("a");

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(nav.activeItem).toBeNull();
  });

  it("other keys are ignored while the menu is open", async () => {
    const nav = new NavigationMenu();
    nav.onBeforeMount?.();
    const item = new NavigationMenuItem({ nav, value: "a" });
    mount(() => <NavigationMenuContent item={item}>panel</NavigationMenuContent>);
    await Promise.resolve();
    nav.open("a");

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true }));
    expect(nav.activeItem).toBe("a");
  });

  it("Escape is a no-op when this item's menu is not open", async () => {
    const nav = new NavigationMenu();
    nav.onBeforeMount?.();
    const item = new NavigationMenuItem({ nav, value: "a" });
    mount(() => <NavigationMenuContent item={item}>panel</NavigationMenuContent>);
    await Promise.resolve();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(nav.activeItem).toBeNull();
  });

  it("mousedown outside the trigger and content closes the active item's menu", async () => {
    const nav = new NavigationMenu();
    nav.onBeforeMount?.();
    const item = new NavigationMenuItem({ nav, value: "a" });
    mount(() => <NavigationMenuContent item={item}>panel</NavigationMenuContent>);
    await Promise.resolve();
    nav.open("a");

    const outside = document.createElement("button");
    document.body.appendChild(outside);
    outside.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(nav.activeItem).toBeNull();
  });

  it("mousedown inside the content, or on the registered trigger, does not close the menu", async () => {
    const nav = new NavigationMenu();
    nav.onBeforeMount?.();
    const item = new NavigationMenuItem({ nav, value: "a" });
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    item._registerTrigger(trigger);
    const container = mount(() => <NavigationMenuContent item={item}>panel</NavigationMenuContent>);
    await Promise.resolve();
    nav.open("a");

    const panel = container.querySelector("div") as HTMLElement;
    panel.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(nav.activeItem).toBe("a");

    trigger.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(nav.activeItem).toBe("a");
  });

  it("removes its document listeners on unmount", async () => {
    const nav = new NavigationMenu();
    nav.onBeforeMount?.();
    const item = new NavigationMenuItem({ nav, value: "a" });
    const content = new NavigationMenuContent({ item });
    content.onMount?.();
    nav.open("a");

    content.onUnmount?.();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(nav.activeItem).toBe("a");
  });
});

describe("NavigationMenuLink", () => {
  it("renders an anchor with href, target, rel, class, id", () => {
    const container = mount(() => (
      <NavigationMenuLink href="/docs" target="_blank" rel="noopener" class="lnk" id="lnk-1">
        Docs
      </NavigationMenuLink>
    ));
    const a = container.querySelector("a") as HTMLAnchorElement;
    expect(a.id).toBe("lnk-1");
    expect(a.className).toBe("lnk");
    expect(a.getAttribute("href")).toBe("/docs");
    expect(a.target).toBe("_blank");
    expect(a.rel).toBe("noopener");
    expect(a.textContent).toBe("Docs");
  });

  it("forwards onClick, letting consumers preventDefault a placeholder href", () => {
    const onClick = vi.fn((e: MouseEvent) => { e.preventDefault(); });
    const container = mount(() => (
      <NavigationMenuLink href="#" onClick={onClick}>
        Docs
      </NavigationMenuLink>
    ));
    const a = container.querySelector("a") as HTMLAnchorElement;
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    a.dispatchEvent(event);
    expect(onClick).toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(true);
  });
});
