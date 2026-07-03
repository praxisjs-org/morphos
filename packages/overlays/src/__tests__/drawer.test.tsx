// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@praxisjs/runtime";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "../drawer/drawer";

afterEach(() => {
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  render(node as () => Node, container);
  return container;
}

describe("Drawer", () => {
  it("starts closed by default, open with defaultOpen, side defaults to right", () => {
    const a = new Drawer();
    a.onBeforeMount?.();
    expect(a.isOpen).toBe(false);
    expect(a.side).toBe("right");

    const b = new Drawer({ defaultOpen: true });
    b.onBeforeMount?.();
    expect(b.isOpen).toBe(true);
  });

  it("openDrawer/closeDrawer/toggle manage uncontrolled state and fire onOpenChange", () => {
    const onOpenChange = vi.fn();
    const d = new Drawer({ onOpenChange });
    d.onBeforeMount?.();

    d.openDrawer();
    expect(d.isOpen).toBe(true);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    d.closeDrawer();
    expect(d.isOpen).toBe(false);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    d.toggle();
    expect(d.isOpen).toBe(true);
    d.toggle();
    expect(d.isOpen).toBe(false);
  });

  it("respects a controlled open prop across open/close/toggle while still emitting", () => {
    const onOpenChange = vi.fn();
    const d = new Drawer({ open: false, onOpenChange });
    d.onBeforeMount?.();
    d.openDrawer();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(d.isOpen).toBe(false);
    d.closeDrawer();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    d.toggle();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(d.isOpen).toBe(false);
  });

  it("renders its children when used as a JSX wrapper", () => {
    const container = mount(() => (
      <Drawer>
        <span>wrapped</span>
      </Drawer>
    ));
    expect(container.textContent).toBe("wrapped");
  });
});

describe("DrawerTrigger", () => {
  it("opens the drawer on click and reflects state", () => {
    const drawer = new Drawer();
    drawer.onBeforeMount?.();
    const container = mount(() => (
      <DrawerTrigger drawer={drawer} id="t1" class="tr">
        Open
      </DrawerTrigger>
    ));
    const button = container.querySelector("button") as HTMLButtonElement;
    expect(button.id).toBe("t1");
    expect(button.className).toBe("tr");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    button.click();
    expect(drawer.isOpen).toBe(true);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(button.getAttribute("data-open")).toBe("");
  });
});

describe("DrawerContent", () => {
  it("renders nothing while closed", () => {
    const drawer = new Drawer();
    drawer.onBeforeMount?.();
    mount(() => <DrawerContent drawer={drawer}>hi</DrawerContent>);
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it("portals a backdrop + panel into document.body when open, applying focus trap and scroll lock", async () => {
    const drawer = new Drawer({ defaultOpen: true, side: "left" });
    drawer.onBeforeMount?.();
    mount(() => (
      <DrawerContent drawer={drawer} id="dr-1" class="c" aria-label="al" aria-labelledby="alb" aria-describedby="adb">
        <button>Close</button>
      </DrawerContent>
    ));
    await Promise.resolve();
    expect(document.querySelector("[data-morphos-backdrop]")).toBeTruthy();
    const panel = document.querySelector('[role="dialog"]') as HTMLElement;
    expect(panel.id).toBe("dr-1");
    expect(panel.className).toBe("c");
    expect(panel.getAttribute("aria-modal")).toBe("true");
    expect(panel.getAttribute("aria-label")).toBe("al");
    expect(panel.getAttribute("aria-labelledby")).toBe("alb");
    expect(panel.getAttribute("aria-describedby")).toBe("adb");
    expect(panel.getAttribute("data-open")).toBe("");
    expect(panel.getAttribute("data-side")).toBe("left");
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.activeElement?.tagName).toBe("BUTTON");
  });

  it("generates a fallback id when none is provided", async () => {
    const drawer = new Drawer({ defaultOpen: true });
    drawer.onBeforeMount?.();
    mount(() => <DrawerContent drawer={drawer} />);
    await Promise.resolve();
    const panel = document.querySelector('[role="dialog"]') as HTMLElement;
    expect(panel.id).toMatch(/^drawer-/);
  });

  it("opening later (not at initial mount) still applies constraints", async () => {
    const drawer = new Drawer();
    drawer.onBeforeMount?.();
    mount(() => (
      <DrawerContent drawer={drawer}>
        <button>Close</button>
      </DrawerContent>
    ));
    await Promise.resolve();
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    drawer.openDrawer();
    await Promise.resolve();
    expect(document.querySelector('[role="dialog"]')).toBeTruthy();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("closing releases the scroll lock", async () => {
    const drawer = new Drawer({ defaultOpen: true });
    drawer.onBeforeMount?.();
    mount(() => <DrawerContent drawer={drawer} />);
    await Promise.resolve();
    expect(document.body.style.overflow).toBe("hidden");
    drawer.closeDrawer();
    await Promise.resolve();
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("clicking the backdrop closes the drawer by default", async () => {
    const drawer = new Drawer({ defaultOpen: true });
    drawer.onBeforeMount?.();
    mount(() => <DrawerContent drawer={drawer} />);
    await Promise.resolve();
    const backdrop = document.querySelector("[data-morphos-backdrop]") as HTMLElement;
    backdrop.click();
    expect(drawer.isOpen).toBe(false);
  });

  it("clicking the backdrop does nothing when closeOnBackdropClick is false", async () => {
    const drawer = new Drawer({ defaultOpen: true, closeOnBackdropClick: false });
    drawer.onBeforeMount?.();
    mount(() => <DrawerContent drawer={drawer} />);
    await Promise.resolve();
    const backdrop = document.querySelector("[data-morphos-backdrop]") as HTMLElement;
    backdrop.click();
    expect(drawer.isOpen).toBe(true);
  });

  it("Escape closes the drawer when closeOnEscape is true (default)", async () => {
    const drawer = new Drawer({ defaultOpen: true });
    drawer.onBeforeMount?.();
    mount(() => (
      <DrawerContent drawer={drawer}>
        <button>Close</button>
      </DrawerContent>
    ));
    await Promise.resolve();
    const panel = document.querySelector('[role="dialog"]') as HTMLElement;
    panel.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(drawer.isOpen).toBe(false);
  });

  it("Escape does nothing when closeOnEscape is false; other keys are ignored", async () => {
    const drawer = new Drawer({ defaultOpen: true, closeOnEscape: false });
    drawer.onBeforeMount?.();
    mount(() => <DrawerContent drawer={drawer} />);
    await Promise.resolve();
    const panel = document.querySelector('[role="dialog"]') as HTMLElement;
    panel.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(drawer.isOpen).toBe(true);
    panel.dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true }));
    expect(drawer.isOpen).toBe(true);
  });

  it("_applyConstraints tolerates a content ref that never resolved (defensive branch)", () => {
    const drawer = new Drawer({ defaultOpen: true });
    drawer.onBeforeMount?.();
    const content = new DrawerContent({ drawer });
    expect(() => {
      (content as unknown as { _applyConstraints: () => void })._applyConstraints();
    }).not.toThrow();
  });

  it("unmounting while open releases constraints without throwing", async () => {
    const drawer = new Drawer({ defaultOpen: true });
    drawer.onBeforeMount?.();
    const container = document.createElement("div");
    document.body.appendChild(container);
    const dispose = render(() => <DrawerContent drawer={drawer} />, container);
    await Promise.resolve();
    expect(() => { dispose(); }).not.toThrow();
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("supports all side values", async () => {
    for (const side of ["top", "bottom", "left", "right"] as const) {
      const drawer = new Drawer({ defaultOpen: true, side });
      drawer.onBeforeMount?.();
      mount(() => <DrawerContent drawer={drawer} />);
      await Promise.resolve();
      const panel = document.querySelector('[role="dialog"]') as HTMLElement;
      expect(panel.getAttribute("data-side")).toBe(side);
      document.body.innerHTML = "";
    }
  });
});

describe("DrawerTitle", () => {
  it("defaults to an h2, supports a custom tag", () => {
    const container = mount(() => <DrawerTitle id="t" class="ti">Settings</DrawerTitle>);
    const h2 = container.querySelector("h2");
    expect(h2?.id).toBe("t");
    expect(h2?.className).toBe("ti");
    expect(h2?.textContent).toBe("Settings");

    const container2 = mount(() => <DrawerTitle as="h1">Title</DrawerTitle>);
    expect(container2.querySelector("h1")).toBeTruthy();
  });
});

describe("DrawerDescription", () => {
  it("renders a paragraph with id and class", () => {
    const container = mount(() => <DrawerDescription id="d" class="de">Manage settings</DrawerDescription>);
    const p = container.querySelector("p");
    expect(p?.id).toBe("d");
    expect(p?.className).toBe("de");
    expect(p?.textContent).toBe("Manage settings");
  });
});

describe("DrawerClose", () => {
  it("closes the drawer on click and has a default aria-label", () => {
    const drawer = new Drawer({ defaultOpen: true });
    drawer.onBeforeMount?.();
    const container = mount(() => (
      <DrawerClose drawer={drawer} id="c" class="ca">
        X
      </DrawerClose>
    ));
    const button = container.querySelector("button") as HTMLButtonElement;
    expect(button.id).toBe("c");
    expect(button.className).toBe("ca");
    expect(button.getAttribute("aria-label")).toBe("Close drawer");
    button.click();
    expect(drawer.isOpen).toBe(false);
  });
});
