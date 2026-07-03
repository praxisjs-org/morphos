// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render } from "@praxisjs/runtime";

import { Disclosure, DisclosureTrigger, DisclosureContent } from "../disclosure/disclosure";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("Disclosure render", () => {
  it("renders the root with id, class and data-open reflecting closed state", () => {
    const container = mount(() => (
      <Disclosure id="d1" class="dc">
        <div>child</div>
      </Disclosure>
    ));
    const root = container.firstElementChild as HTMLElement;
    expect(root.id).toBe("d1");
    expect(root.className).toBe("dc");
    expect(root.hasAttribute("data-open")).toBe(false);
    expect(root.textContent).toBe("child");
  });

  it("renders with data-open when defaultOpen is true", () => {
    const container = mount(() => <Disclosure defaultOpen>content</Disclosure>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute("data-open")).toBe("");
  });

  it("DisclosureTrigger toggles the disclosure on click and reflects aria/data state", () => {
    const disclosure = new Disclosure();
    disclosure.onBeforeMount?.();
    const container = mount(() => (
      <DisclosureTrigger disclosure={disclosure} id="trig" class="tc" aria-label="Toggle it">
        Toggle
      </DisclosureTrigger>
    ));
    const btn = container.querySelector("#trig") as HTMLButtonElement;
    expect(btn.className).toBe("tc");
    expect(btn.type).toBe("button");
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    expect(btn.getAttribute("aria-controls")).toBe(disclosure.contentId);
    expect(btn.getAttribute("aria-label")).toBe("Toggle it");
    expect(btn.hasAttribute("data-open")).toBe(false);

    btn.click();
    expect(disclosure.isOpen).toBe(true);
    expect(btn.getAttribute("aria-expanded")).toBe("true");
    expect(btn.getAttribute("data-open")).toBe("");
  });

  it("DisclosureContent is hidden when closed, visible when open, using disclosure.contentId as fallback id", () => {
    const disclosure = new Disclosure({ defaultOpen: true });
    disclosure.onBeforeMount?.();
    const container = mount(() => (
      <DisclosureContent disclosure={disclosure} class="cc">
        Body
      </DisclosureContent>
    ));
    const content = container.firstElementChild as HTMLElement;
    expect(content.id).toBe(disclosure.contentId);
    expect(content.className).toBe("cc");
    expect((content as HTMLElement & { hidden: boolean }).hidden).toBe(false);
    expect(content.getAttribute("data-open")).toBe("");

    disclosure.toggle();
    expect((content as HTMLElement & { hidden: boolean }).hidden).toBe(true);
    expect(content.hasAttribute("data-open")).toBe(false);
  });

  it("DisclosureContent respects an explicit id override", () => {
    const disclosure = new Disclosure();
    disclosure.onBeforeMount?.();
    const container = mount(() => (
      <DisclosureContent disclosure={disclosure} id="custom-id">
        Body
      </DisclosureContent>
    ));
    const content = container.firstElementChild as HTMLElement;
    expect(content.id).toBe("custom-id");
  });

  it("in controlled mode (open set), toggling emits without changing isOpen", () => {
    const onOpenChange = vi.fn();
    const disclosure = new Disclosure({ open: false, onOpenChange });
    disclosure.onBeforeMount?.();
    disclosure.toggle();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(disclosure.isOpen).toBe(false);
  });
});
