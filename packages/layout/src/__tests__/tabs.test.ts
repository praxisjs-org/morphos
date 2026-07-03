import { describe, it, expect, vi } from "vitest";

import { Tabs } from "../tabs/tabs";

describe("Tabs", () => {
  it("starts with no selection when no defaultValue", () => {
    const tabs = new Tabs();
    tabs.onBeforeMount?.();
    expect(tabs.selectedValue).toBeUndefined();
  });

  it("starts with the defaultValue selected", () => {
    const tabs = new Tabs({ defaultValue: "b" });
    tabs.onBeforeMount?.();
    expect(tabs.selectedValue).toBe("b");
  });

  it("select() updates the selected value", () => {
    const tabs = new Tabs({ defaultValue: "a" });
    tabs.onBeforeMount?.();
    tabs.select("b");
    expect(tabs.selectedValue).toBe("b");
  });

  it("calls onValueChange when a tab is selected", () => {
    const onValueChange = vi.fn();
    const tabs = new Tabs({ onValueChange });
    tabs.select("x");
    expect(onValueChange).toHaveBeenCalledWith("x");
  });

  it("navigate wraps around tab values", () => {
    const tabs = new Tabs({ defaultValue: "a" });
    tabs.onBeforeMount?.();
    tabs._tabValues.push("a", "b", "c");
    tabs.navigate("next");
    expect(tabs.selectedValue).toBe("b");
    tabs.navigate("next");
    expect(tabs.selectedValue).toBe("c");
    tabs.navigate("next");
    expect(tabs.selectedValue).toBe("a");
  });

  it("navigate to first and last", () => {
    const tabs = new Tabs({ defaultValue: "b" });
    tabs.onBeforeMount?.();
    tabs._tabValues.push("a", "b", "c");
    tabs.navigate("first");
    expect(tabs.selectedValue).toBe("a");
    tabs.navigate("last");
    expect(tabs.selectedValue).toBe("c");
  });

  it("navigate is a no-op when there are no registered tabs", () => {
    const tabs = new Tabs();
    tabs.onBeforeMount?.();
    expect(() => { tabs.navigate("next"); }).not.toThrow();
    expect(tabs.selectedValue).toBeUndefined();
  });

  it("navigate('next') from an unselected state starts from the first tab", () => {
    const tabs = new Tabs();
    tabs.onBeforeMount?.();
    tabs._tabValues.push("a", "b", "c");
    tabs.navigate("next");
    expect(tabs.selectedValue).toBe("a");
  });
});
