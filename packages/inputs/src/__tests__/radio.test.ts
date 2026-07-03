import { describe, it, expect, vi } from "vitest";

import { RadioGroup } from "../radio/radio-group";

describe("RadioGroup", () => {
  it("is a class", () => {
    expect(typeof RadioGroup).toBe("function");
  });

  it("initialises _value from defaultValue on mount", () => {
    const group = new RadioGroup({ defaultValue: "b" });
    group.onBeforeMount?.();
    expect(group.defaultValue).toBe("b");
  });

  it("select() updates selected value in uncontrolled mode", () => {
    const group = new RadioGroup({ defaultValue: "a" });
    group.onBeforeMount?.();
    group.select("b");
    expect(group.selectedValue).toBe("b");
  });

  it("select() calls onValueChange", () => {
    const onValueChange = vi.fn();
    const group = new RadioGroup({ onValueChange });
    group.select("x");
    expect(onValueChange).toHaveBeenCalledWith("x");
  });

  it("respects controlled value", () => {
    const group = new RadioGroup({ value: "controlled" });
    group.select("other");
    expect(group.selectedValue).toBe("controlled");
  });
});
