import { describe, it, expect, vi } from "vitest";

import { Dialog } from "../dialog/dialog";

describe("Dialog", () => {
  it("is a class", () => {
    expect(typeof Dialog).toBe("function");
  });

  it("starts closed by default", () => {
    const dialog = new Dialog();
    dialog.onBeforeMount?.();
    expect(dialog.isOpen).toBe(false);
  });

  it("starts open when defaultOpen is true", () => {
    const dialog = new Dialog({ defaultOpen: true });
    dialog.onBeforeMount?.();
    expect(dialog.isOpen).toBe(true);
  });

  it("openDialog() sets isOpen to true", () => {
    const dialog = new Dialog();
    dialog.onBeforeMount?.();
    dialog.openDialog();
    expect(dialog.isOpen).toBe(true);
  });

  it("closeDialog() sets isOpen to false", () => {
    const dialog = new Dialog({ defaultOpen: true });
    dialog.onBeforeMount?.();
    dialog.closeDialog();
    expect(dialog.isOpen).toBe(false);
  });

  it("toggle() inverts the open state", () => {
    const dialog = new Dialog();
    dialog.onBeforeMount?.();
    dialog.toggle();
    expect(dialog.isOpen).toBe(true);
    dialog.toggle();
    expect(dialog.isOpen).toBe(false);
  });

  it("calls onOpenChange when state changes", () => {
    const onOpenChange = vi.fn();
    const dialog = new Dialog({ onOpenChange });
    dialog.openDialog();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    dialog.closeDialog();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("respects controlled open prop", () => {
    const dialog = new Dialog({ open: false });
    dialog.openDialog();
    // controlled — should not change internal state
    expect(dialog.isOpen).toBe(false);
  });

  it("closeDialog() in controlled mode emits but does not change internal state", () => {
    const onOpenChange = vi.fn();
    const dialog = new Dialog({ open: true, onOpenChange });
    dialog.closeDialog();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(dialog.isOpen).toBe(true);
  });

  it("toggle() in controlled mode emits but does not change internal state", () => {
    const onOpenChange = vi.fn();
    const dialog = new Dialog({ open: false, onOpenChange });
    dialog.toggle();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(dialog.isOpen).toBe(false);
  });
});
