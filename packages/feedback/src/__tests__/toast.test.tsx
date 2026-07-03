// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@praxisjs/runtime";

import { Toast, ToastProvider } from "../toast/toast";

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
});

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("ToastProvider render", () => {
  it("renders its region and children, with no toasts initially", () => {
    const container = mount(() => (
      <ToastProvider id="tp" class="tpc">
        <span>app content</span>
      </ToastProvider>
    ));
    expect(container.querySelector("span")?.textContent).toBe("app content");
    const region = document.querySelector('[role="region"]') as HTMLElement;
    expect(region.id).toBe("tp");
    expect(region.className).toBe("tpc");
    expect(region.getAttribute("aria-label")).toBe("Notifications");
    expect(region.getAttribute("aria-live")).toBe("polite");
    expect(region.getAttribute("aria-atomic")).toBe("false");
    expect(region.children).toHaveLength(0);
  });

  it("renders a toast with title, description, and default variant", async () => {
    let provider!: ToastProvider;
    mount(() => (
      <ToastProvider ref={(inst: ToastProvider | null) => { if (inst) provider = inst; }} />
    ));
    await Promise.resolve();
    provider.add({ title: "Saved", description: "Your changes were saved.", duration: 0 });

    const toastEl = document.querySelector('[role="status"]') as HTMLElement;
    expect(toastEl.getAttribute("data-variant")).toBe("info");
    const spans = toastEl.querySelectorAll("span");
    expect(spans[0].textContent).toBe("Saved");
    expect(spans[1].textContent).toBe("Your changes were saved.");
  });

  it("renders without a description span when none is given", async () => {
    let provider!: ToastProvider;
    mount(() => (
      <ToastProvider ref={(inst: ToastProvider | null) => { if (inst) provider = inst; }} />
    ));
    await Promise.resolve();
    provider.add({ title: "Saved", duration: 0 });
    const toastEl = document.querySelector('[role="status"]') as HTMLElement;
    expect(toastEl.querySelectorAll("span")).toHaveLength(1);
  });

  it("respects a custom variant", async () => {
    let provider!: ToastProvider;
    mount(() => (
      <ToastProvider ref={(inst: ToastProvider | null) => { if (inst) provider = inst; }} />
    ));
    await Promise.resolve();
    provider.add({ title: "Oops", variant: "error", duration: 0 });
    expect(document.querySelector('[role="status"]')?.getAttribute("data-variant")).toBe("error");
  });

  it("the dismiss button removes the toast from the DOM", async () => {
    let provider!: ToastProvider;
    mount(() => (
      <ToastProvider ref={(inst: ToastProvider | null) => { if (inst) provider = inst; }} />
    ));
    await Promise.resolve();
    provider.add({ title: "Bye", duration: 0 });
    const button = document.querySelector('[role="status"] button') as HTMLButtonElement;
    expect(button.getAttribute("aria-label")).toBe("Dismiss notification");
    button.click();
    expect(document.querySelector('[role="status"]')).toBeNull();
    expect(provider.toasts).toHaveLength(0);
  });
});

describe("Toast", () => {
  it("renders default content (title/description/dismiss button) wired to provider.dismiss", () => {
    const provider = new ToastProvider();
    provider.onBeforeMount?.();
    const toast = { id: "t1", title: "Hi", description: "there" };
    const container = mount(() => (
      <Toast toast={toast} provider={provider} class="tc" />
    ));
    const root = container.querySelector('[role="status"]') as HTMLElement;
    expect(root.id).toBe("t1");
    expect(root.className).toBe("tc");
    expect(root.getAttribute("data-variant")).toBe("info");
    const spans = root.querySelectorAll("span");
    expect(spans[0].textContent).toBe("Hi");
    expect(spans[1].textContent).toBe("there");

    const button = root.querySelector("button") as HTMLButtonElement;
    button.click();
    expect(provider.toasts).toHaveLength(0);
  });

  it("uses an explicit id and variant when provided", () => {
    const provider = new ToastProvider();
    provider.onBeforeMount?.();
    const toast = { id: "t2", title: "Warn", variant: "warning" as const };
    const container = mount(() => <Toast toast={toast} provider={provider} id="custom-id" />);
    expect(container.querySelector("#custom-id")?.getAttribute("data-variant")).toBe("warning");
  });

  it("renders without a description span when none is given", () => {
    const provider = new ToastProvider();
    provider.onBeforeMount?.();
    const toast = { id: "t3", title: "No desc" };
    const container = mount(() => <Toast toast={toast} provider={provider} />);
    expect(container.querySelectorAll('[role="status"] span')).toHaveLength(1);
  });

  it("renders custom children instead of the default content", () => {
    const provider = new ToastProvider();
    provider.onBeforeMount?.();
    const toast = { id: "t4", title: "Ignored" };
    const container = mount(() => (
      <Toast toast={toast} provider={provider}>
        <em>Custom body</em>
      </Toast>
    ));
    expect(container.querySelector("em")?.textContent).toBe("Custom body");
    expect(container.querySelector("button")).toBeNull();
  });
});
