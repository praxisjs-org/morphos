// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { render } from "@praxisjs/runtime";

import { ToastProvider } from "../toast/toast";

afterEach(() => {
  document.body.innerHTML = "";
});

async function mountProvider(): Promise<ToastProvider> {
  let provider: ToastProvider | undefined;
  const container = document.createElement("div");
  render(() => (
    <ToastProvider ref={(inst: ToastProvider | null) => { if (inst) provider = inst; }} />
  ) as Node, container);
  await Promise.resolve();
  if (!provider) throw new Error("ToastProvider ref was not set");
  return provider;
}

function toastElements(): Element[] {
  return [...document.querySelectorAll('[role="status"]')];
}

describe("ToastProvider keyed toasts", () => {
  it("adding a toast keeps the elements of the toasts already shown", async () => {
    const provider = await mountProvider();
    provider.add({ title: "First", duration: 0 });
    const [first] = toastElements();

    provider.add({ title: "Second", duration: 0 });
    const shown = toastElements();
    expect(shown).toHaveLength(2);
    expect(shown[0]).toBe(first);
    expect(shown[1].querySelector("span")?.textContent).toBe("Second");
  });

  it("dismissing a toast removes only its element", async () => {
    const provider = await mountProvider();
    provider.add({ title: "One", duration: 0 });
    const middle = provider.add({ title: "Two", duration: 0 });
    provider.add({ title: "Three", duration: 0 });
    const [one, , three] = toastElements();

    provider.dismiss(middle);
    expect(toastElements()).toEqual([one, three]);
  });

  it("updates a toast replaced under the same id in place", async () => {
    const provider = await mountProvider();
    const id = provider.add({ title: "Uploading", duration: 0 });
    const [el] = toastElements();

    provider._toasts = provider._toasts.map((t) =>
      t.id === id ? { ...t, title: "Uploaded", description: "3 files", variant: "success" as const } : t,
    );
    expect(toastElements()).toEqual([el]);
    expect(el.getAttribute("data-variant")).toBe("success");
    expect([...el.querySelectorAll("span")].map((s) => s.textContent)).toEqual(["Uploaded", "3 files"]);
  });
});
