// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render } from "@praxisjs/runtime";

import { Tabs, TabList, Tab, TabPanel } from "../tabs/tabs";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("Tabs render", () => {
  it("renders the root with id, class and data-orientation (default horizontal)", () => {
    const container = mount(() => (
      <Tabs id="t1" class="tc">
        <span>child</span>
      </Tabs>
    ));
    const root = container.firstElementChild as HTMLElement;
    expect(root.id).toBe("t1");
    expect(root.className).toBe("tc");
    expect(root.getAttribute("data-orientation")).toBe("horizontal");
    expect(root.textContent).toBe("child");
  });

  it("respects an explicit orientation", () => {
    const container = mount(() => <Tabs orientation="vertical">x</Tabs>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute("data-orientation")).toBe("vertical");
  });
});

describe("TabList", () => {
  it("renders role=tablist with id, class, aria-label(ledby) and orientation", () => {
    const tabs = new Tabs();
    tabs.onBeforeMount?.();
    const container = mount(() => (
      <TabList tabs={tabs} id="tl" class="lc" aria-label="al" aria-labelledby="alb">
        <span>x</span>
      </TabList>
    ));
    const list = container.querySelector("#tl") as HTMLElement;
    expect(list.className).toBe("lc");
    expect(list.getAttribute("role")).toBe("tablist");
    expect(list.getAttribute("aria-label")).toBe("al");
    expect(list.getAttribute("aria-labelledby")).toBe("alb");
    expect(list.getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("ArrowRight/ArrowLeft navigate horizontally", () => {
    const tabs = new Tabs({ defaultValue: "a" });
    tabs.onBeforeMount?.();
    tabs._tabValues.push("a", "b", "c");
    const container = mount(() => <TabList tabs={tabs} />);
    const list = container.firstElementChild as HTMLElement;

    list.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
    expect(tabs.selectedValue).toBe("b");
    list.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true }));
    expect(tabs.selectedValue).toBe("a");
  });

  it("ArrowDown/ArrowUp navigate vertically, and are ignored when horizontal", () => {
    const tabs = new Tabs({ defaultValue: "a", orientation: "vertical" });
    tabs.onBeforeMount?.();
    tabs._tabValues.push("a", "b", "c");
    const container = mount(() => <TabList tabs={tabs} />);
    const list = container.firstElementChild as HTMLElement;

    list.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    expect(tabs.selectedValue).toBe("b");
    list.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true, cancelable: true }));
    expect(tabs.selectedValue).toBe("a");

    list.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
    expect(tabs.selectedValue).toBe("a");
  });

  it("ArrowRight/ArrowLeft are ignored when vertical", () => {
    const tabs = new Tabs({ defaultValue: "a", orientation: "vertical" });
    tabs.onBeforeMount?.();
    tabs._tabValues.push("a", "b", "c");
    const container = mount(() => <TabList tabs={tabs} />);
    const list = container.firstElementChild as HTMLElement;
    list.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true }));
    expect(tabs.selectedValue).toBe("a");
  });

  it("Home/End jump to the first/last tab", () => {
    const tabs = new Tabs({ defaultValue: "b" });
    tabs.onBeforeMount?.();
    tabs._tabValues.push("a", "b", "c");
    const container = mount(() => <TabList tabs={tabs} />);
    const list = container.firstElementChild as HTMLElement;

    list.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true, cancelable: true }));
    expect(tabs.selectedValue).toBe("c");
    list.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true, cancelable: true }));
    expect(tabs.selectedValue).toBe("a");
  });

  it("other keys are ignored", () => {
    const tabs = new Tabs({ defaultValue: "a" });
    tabs.onBeforeMount?.();
    tabs._tabValues.push("a", "b", "c");
    const container = mount(() => <TabList tabs={tabs} />);
    const list = container.firstElementChild as HTMLElement;
    list.dispatchEvent(new KeyboardEvent("keydown", { key: "x", bubbles: true, cancelable: true }));
    expect(tabs.selectedValue).toBe("a");
  });
});

describe("Tab", () => {
  it("registers itself in tabs._tabValues on mount and unregisters on unmount", async () => {
    const tabs = new Tabs();
    tabs.onBeforeMount?.();
    const container = document.createElement("div");
    const dispose = render(() => <Tab tabs={tabs} value="a">A</Tab>, container);
    await Promise.resolve();
    expect(tabs._tabValues).toContain("a");
    dispose();
    expect(tabs._tabValues).not.toContain("a");
  });

  it("does not register the same value twice", async () => {
    const tabs = new Tabs();
    tabs.onBeforeMount?.();
    tabs._tabValues.push("a");
    render(() => <Tab tabs={tabs} value="a">A</Tab>, document.createElement("div"));
    await Promise.resolve();
    expect(tabs._tabValues.filter((v) => v === "a")).toHaveLength(1);
  });

  it("onUnmount is a no-op when the tab was never registered", () => {
    const tabs = new Tabs();
    tabs.onBeforeMount?.();
    const tab = new Tab({ tabs, value: "a" });
    expect(() => { tab.onUnmount?.(); }).not.toThrow();
    expect(tabs._tabValues).not.toContain("a");
  });

  it("renders tab button attributes and reflects selected/disabled state", () => {
    const tabs = new Tabs({ defaultValue: "a" });
    tabs.onBeforeMount?.();
    const container = mount(() => (
      <Tab tabs={tabs} value="a" id="tab-a" class="tac">
        Tab A
      </Tab>
    ));
    const btn = container.querySelector("#tab-a") as HTMLButtonElement;
    expect(btn.className).toBe("tac");
    expect(btn.type).toBe("button");
    expect(btn.getAttribute("role")).toBe("tab");
    expect(btn.disabled).toBe(false);
    expect(btn.getAttribute("aria-selected")).toBe("true");
    expect(btn.tabIndex).toBe(0);
    expect(btn.getAttribute("data-selected")).toBe("");
    expect(btn.hasAttribute("aria-disabled")).toBe(false);
    expect(btn.hasAttribute("data-disabled")).toBe(false);
  });

  it("unselected tabs get tabIndex -1 and no data-selected", () => {
    const tabs = new Tabs({ defaultValue: "a" });
    tabs.onBeforeMount?.();
    const container = mount(() => <Tab tabs={tabs} value="b">Tab B</Tab>);
    const btn = container.querySelector("button") as HTMLButtonElement;
    expect(btn.getAttribute("aria-selected")).toBe("false");
    expect(btn.tabIndex).toBe(-1);
    expect(btn.hasAttribute("data-selected")).toBe(false);
  });

  it("disabled reflects aria-disabled/data-disabled and blocks selection on click", () => {
    const tabs = new Tabs({ defaultValue: "a" });
    tabs.onBeforeMount?.();
    const container = mount(() => (
      <Tab tabs={tabs} value="b" disabled>
        Tab B
      </Tab>
    ));
    const btn = container.querySelector("button") as HTMLButtonElement;
    expect(btn.getAttribute("aria-disabled")).toBe("true");
    expect(btn.getAttribute("data-disabled")).toBe("");

    // Native disabled buttons don't dispatch "click" via .click(); dispatch the
    // event directly to exercise the component's own disabled guard.
    btn.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(tabs.selectedValue).toBe("a");
  });

  it("clicking an enabled tab selects it", () => {
    const onValueChange = vi.fn();
    const tabs = new Tabs({ defaultValue: "a", onValueChange });
    tabs.onBeforeMount?.();
    const container = mount(() => <Tab tabs={tabs} value="b">Tab B</Tab>);
    const btn = container.querySelector("button") as HTMLButtonElement;
    btn.click();
    expect(tabs.selectedValue).toBe("b");
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("falls back to a generated id and exposes panelId", () => {
    const tabs = new Tabs();
    tabs.onBeforeMount?.();
    const tab = new Tab({ tabs, value: "a" });
    expect(tab.panelId).toMatch(/tab-panel/);
    const container = mount(() => <Tab tabs={tabs} value="a">A</Tab>);
    const btn = container.querySelector("button") as HTMLButtonElement;
    expect(btn.id).toMatch(/^tab-/);
  });
});

describe("TabPanel", () => {
  it("is visible for the selected value and hidden otherwise, with data-selected reflecting it", () => {
    const tabs = new Tabs({ defaultValue: "a" });
    tabs.onBeforeMount?.();
    const container = mount(() => (
      <>
        <TabPanel tabs={tabs} value="a" id="panel-a" class="pc">
          A content
        </TabPanel>
        <TabPanel tabs={tabs} value="b" id="panel-b">
          B content
        </TabPanel>
      </>
    ));
    const panelA = container.querySelector("#panel-a") as HTMLElement;
    const panelB = container.querySelector("#panel-b") as HTMLElement;
    expect(panelA.className).toBe("pc");
    expect(panelA.getAttribute("role")).toBe("tabpanel");
    expect(panelA.getAttribute("aria-labelledby")).toBe("a");
    expect((panelA as HTMLElement & { hidden: boolean }).hidden).toBe(false);
    expect(panelA.getAttribute("data-selected")).toBe("");
    expect((panelB as HTMLElement & { hidden: boolean }).hidden).toBe(true);
    expect(panelB.hasAttribute("data-selected")).toBe(false);

    tabs.select("b");
    expect((panelA as HTMLElement & { hidden: boolean }).hidden).toBe(true);
    expect((panelB as HTMLElement & { hidden: boolean }).hidden).toBe(false);
  });

  it("in controlled mode (value set), selecting a tab emits without changing selectedValue", () => {
    const onValueChange = vi.fn();
    const tabs = new Tabs({ value: "a", onValueChange });
    tabs.onBeforeMount?.();
    tabs.select("b");
    expect(onValueChange).toHaveBeenCalledWith("b");
    expect(tabs.selectedValue).toBe("a");
  });
});
