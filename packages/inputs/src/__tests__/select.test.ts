// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";

import { Select } from "../select/select";

const OPTIONS = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
  { value: "c", label: "Cherry", disabled: true },
];

describe("Select", () => {
  it("is a class", () => {
    expect(typeof Select).toBe("function");
  });

  it("initialises with defaultValue", () => {
    const sel = new Select({ options: OPTIONS, defaultValue: "b" });
    sel.onBeforeMount?.();
    expect(sel.defaultValue).toBe("b");
  });

  it("calls onValueChange when a value is selected", () => {
    const onValueChange = vi.fn();
    const sel = new Select({ options: OPTIONS, onValueChange });
    // Simulate opening and selecting
    (sel as unknown as { _open_: () => void })._open_();
    (sel as unknown as { _select: (o: (typeof OPTIONS)[0]) => void })._select(OPTIONS[1]);
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("does not call onValueChange for disabled options", () => {
    const onValueChange = vi.fn();
    const sel = new Select({ options: OPTIONS, onValueChange });
    (sel as unknown as { _select: (o: (typeof OPTIONS)[0]) => void })._select(OPTIONS[2]);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("respects controlled value", () => {
    const sel = new Select({ options: OPTIONS, value: "a" });
    (sel as unknown as { _select: (o: (typeof OPTIONS)[0]) => void })._select(OPTIONS[1]);
    expect(sel.value).toBe("a");
  });
});
