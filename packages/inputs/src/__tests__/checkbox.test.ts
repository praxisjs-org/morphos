import { describe, it, expect, vi } from "vitest";

import { Checkbox } from "../checkbox/checkbox";

describe("Checkbox", () => {
  it("is a class", () => {
    expect(typeof Checkbox).toBe("function");
  });

  it("can be instantiated", () => {
    const cb = new Checkbox();
    expect(cb).toBeInstanceOf(Checkbox);
  });

  it("initialises _checked from defaultChecked on mount", () => {
    const cb = new Checkbox({ defaultChecked: true });
    cb.onBeforeMount?.();
    expect(cb.defaultChecked).toBe(true);
  });

  it("calls onCheckedChange when provided", () => {
    const onCheckedChange = vi.fn();
    const cb = new Checkbox({ onCheckedChange }) as unknown as {
      _handleChange: (e: Event) => void;
    };
    cb._handleChange({ target: { checked: true } } as unknown as Event);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});
