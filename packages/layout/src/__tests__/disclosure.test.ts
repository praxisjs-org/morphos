import { describe, it, expect, vi } from "vitest";

import { Disclosure } from "../disclosure/disclosure";

describe("Disclosure", () => {
  it("starts closed by default", () => {
    const d = new Disclosure();
    d.onBeforeMount?.();
    expect(d.isOpen).toBe(false);
  });

  it("starts open when defaultOpen is true", () => {
    const d = new Disclosure({ defaultOpen: true });
    d.onBeforeMount?.();
    expect(d.isOpen).toBe(true);
  });

  it("toggle() inverts the open state", () => {
    const d = new Disclosure();
    d.onBeforeMount?.();
    d.toggle();
    expect(d.isOpen).toBe(true);
    d.toggle();
    expect(d.isOpen).toBe(false);
  });

  it("calls onOpenChange on toggle", () => {
    const onOpenChange = vi.fn();
    const d = new Disclosure({ onOpenChange });
    d.toggle();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    d.toggle();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("contentId is a stable string", () => {
    const d = new Disclosure();
    expect(typeof d.contentId).toBe("string");
    expect(d.contentId.startsWith("disclosure-content-")).toBe(true);
  });
});
