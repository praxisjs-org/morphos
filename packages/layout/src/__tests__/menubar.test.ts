// @vitest-environment jsdom
import { describe, it, expect } from "vitest";

import { Menubar, MenubarMenu } from "../menubar/menubar";

function makeTrigger(rect: Partial<DOMRect>): HTMLElement {
  const el = document.createElement("button");
  el.getBoundingClientRect = () => ({
    top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => "",
    ...rect,
  });
  return el;
}

describe("Menubar", () => {
  it("starts with no active menu", () => {
    const menubar = new Menubar();
    expect(menubar.activeMenu).toBeNull();
  });

  it("open() sets the active menu", () => {
    const menubar = new Menubar();
    menubar.open("file");
    expect(menubar.activeMenu).toBe("file");
  });

  it("close() clears the active menu", () => {
    const menubar = new Menubar();
    menubar.open("file");
    menubar.close();
    expect(menubar.activeMenu).toBeNull();
  });

  it("toggle() opens a closed menu and closes an open one", () => {
    const menubar = new Menubar();
    menubar.toggle("file");
    expect(menubar.activeMenu).toBe("file");
    menubar.toggle("file");
    expect(menubar.activeMenu).toBeNull();
  });

  it("toggle() switches directly between two menus", () => {
    const menubar = new Menubar();
    menubar.toggle("file");
    menubar.toggle("edit");
    expect(menubar.activeMenu).toBe("edit");
  });
});

describe("MenubarMenu", () => {
  it("isOpen reflects whether it's the menubar's active menu", () => {
    const menubar = new Menubar();
    const menu = new MenubarMenu({ menubar, value: "file" });
    expect(menu.isOpen).toBe(false);
    menubar.open("file");
    expect(menu.isOpen).toBe(true);
  });

  it("has no position before a trigger is registered", () => {
    const menubar = new Menubar();
    const menu = new MenubarMenu({ menubar, value: "file" });
    menu.onBeforeMount?.();
    menu._updatePosition();
    expect(menu._position).toBeNull();
  });

  it("computes a position relative to the registered trigger", () => {
    const menubar = new Menubar();
    const menu = new MenubarMenu({ menubar, value: "file" });
    menu.onBeforeMount?.();
    menu._registerTrigger(makeTrigger({ top: 100, left: 50, right: 150, bottom: 120 }));
    menu._updatePosition();
    expect(menu._position).toEqual({ top: 124, left: 50, transform: "translate(0, 0)" });
  });

  it("respects side/align/sideOffset props when computing position", () => {
    const menubar = new Menubar();
    const menu = new MenubarMenu({ menubar, value: "file", side: "top", align: "center", sideOffset: 2 });
    menu.onBeforeMount?.();
    menu._registerTrigger(makeTrigger({ top: 100, left: 50, right: 150, bottom: 120, width: 100 }));
    menu._updatePosition();
    expect(menu._position).toEqual({ top: 98, left: 100, transform: "translate(-50%, -100%)" });
  });
});
