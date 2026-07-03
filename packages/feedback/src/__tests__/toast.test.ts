import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { ToastProvider } from "../toast/toast";

describe("ToastProvider", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it("starts with no toasts", () => {
    const provider = new ToastProvider();
    expect(provider.toasts).toHaveLength(0);
  });

  it("add() appends a toast and returns an ID", () => {
    const provider = new ToastProvider();
    const id = provider.add({ title: "Hello", duration: 0 });
    expect(typeof id).toBe("string");
    expect(provider.toasts).toHaveLength(1);
    expect(provider.toasts[0].title).toBe("Hello");
  });

  it("dismiss() removes a toast by ID", () => {
    const provider = new ToastProvider();
    const id = provider.add({ title: "Hello", duration: 0 });
    provider.dismiss(id);
    expect(provider.toasts).toHaveLength(0);
  });

  it("clear() removes all toasts", () => {
    const provider = new ToastProvider();
    provider.add({ title: "A", duration: 0 });
    provider.add({ title: "B", duration: 0 });
    provider.clear();
    expect(provider.toasts).toHaveLength(0);
  });

  it("auto-dismisses after duration", () => {
    const provider = new ToastProvider({ defaultDuration: 3000 });
    provider.add({ title: "Auto", duration: 3000 });
    expect(provider.toasts).toHaveLength(1);
    vi.advanceTimersByTime(3000);
    expect(provider.toasts).toHaveLength(0);
  });

  it("does not auto-dismiss when duration is 0", () => {
    const provider = new ToastProvider();
    provider.add({ title: "Persist", duration: 0 });
    vi.advanceTimersByTime(99999);
    expect(provider.toasts).toHaveLength(1);
  });
});
