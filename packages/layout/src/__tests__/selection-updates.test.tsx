// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { setReactiveObserver } from "@praxisjs/core/internal";
import { render } from "@praxisjs/runtime";

import { Menubar, MenubarMenu, MenubarTrigger } from "../menubar/menubar";
import { NavigationMenu, NavigationMenuItem } from "../navigation-menu/navigation-menu";
import { Tab, TabPanel, Tabs } from "../tabs/tabs";
import { Toolbar, ToolbarButton } from "../toolbar/toolbar";

afterEach(() => {
  document.body.innerHTML = "";
});

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

const values = (count: number) => Array.from({ length: count }, (_, i) => `v${String(i)}`);

describe("selection changes touch only the previous and next part", () => {
  it("Tabs: selecting a tab runs the same effects for 4 or 40 tabs", () => {
    const runsFor = (count: number) => {
      const tabs = new Tabs();
      tabs.onBeforeMount();
      tabs.select("v0");
      const container = mount(() => (
        <div>
          {values(count).map((v) => <Tab tabs={tabs} value={v}>{v}</Tab>)}
          {values(count).map((v) => <TabPanel tabs={tabs} value={v}>{v}</TabPanel>)}
        </div>
      ));
      const runs = countEffects(() => { tabs.select("v2"); });
      const selectedTabs = container.querySelectorAll('[role="tab"][aria-selected="true"]');
      const visiblePanels = container.querySelectorAll('[role="tabpanel"]:not([hidden])');
      expect([...selectedTabs].map((t) => t.textContent)).toEqual(["v2"]);
      expect([...visiblePanels].map((p) => p.textContent)).toEqual(["v2"]);
      return runs;
    };
    expect(runsFor(40)).toBe(runsFor(4));
  });

  it("Menubar: switching menus runs the same effects for 4 or 40 menus", () => {
    const runsFor = (count: number) => {
      const menubar = new Menubar();
      menubar.onBeforeMount();
      const container = mount(() => (
        <div>
          {values(count).map((v) => (
            <MenubarTrigger menu={new MenubarMenu({ menubar, value: v })}>{v}</MenubarTrigger>
          ))}
        </div>
      ));
      menubar.open("v0");
      const runs = countEffects(() => { menubar.open("v1"); });
      const expanded = container.querySelectorAll('[aria-expanded="true"]');
      expect([...expanded].map((t) => t.textContent)).toEqual(["v1"]);
      return runs;
    };
    expect(runsFor(40)).toBe(runsFor(4));
  });

  it("NavigationMenu: switching items runs the same effects for 4 or 40 items", () => {
    const runsFor = (count: number) => {
      const nav = new NavigationMenu();
      nav.onBeforeMount();
      const container = mount(() => (
        <ul>
          {values(count).map((v) => <NavigationMenuItem nav={nav} value={v}>{v}</NavigationMenuItem>)}
        </ul>
      ));
      nav.open("v0");
      const runs = countEffects(() => { nav.open("v1"); });
      expect([...container.querySelectorAll("[data-active]")].map((li) => li.textContent)).toEqual(["v1"]);
      return runs;
    };
    expect(runsFor(40)).toBe(runsFor(4));
  });

  it("Toolbar: moving focus runs the same effects for 4 or 40 buttons", async () => {
    const runsFor = async (count: number) => {
      const toolbar = new Toolbar();
      toolbar.onBeforeMount();
      const container = mount(() => (
        <div>
          {values(count).map((v) => <ToolbarButton toolbar={toolbar}>{v}</ToolbarButton>)}
        </div>
      ));
      await Promise.resolve();
      const event = new KeyboardEvent("keydown", { key: "ArrowRight" });
      const runs = countEffects(() => { toolbar.handleKeyDown(event); });
      const tabStops = [...container.querySelectorAll("button")].filter((b) => b.tabIndex === 0);
      expect(tabStops.map((b) => b.textContent)).toEqual(["v1"]);
      return runs;
    };
    expect(await runsFor(40)).toBe(await runsFor(4));
  });
});
