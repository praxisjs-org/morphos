// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@praxisjs/runtime";

import { PreviewCard, PreviewCardTrigger, PreviewCardContent } from "../preview-card/preview-card";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
});

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  render(node as () => Node, container);
  return container;
}

describe("PreviewCard", () => {
  it("renders its children when used as a JSX wrapper", () => {
    const container = mount(() => (
      <PreviewCard>
        <span>wrapped</span>
      </PreviewCard>
    ));
    expect(container.textContent).toBe("wrapped");
  });

  it("defaults to closed when defaultOpen is unset", () => {
    const card = new PreviewCard();
    card.onBeforeMount?.();
    expect(card.isOpen).toBe(false);
  });

  it("openCard()/closeCard() in controlled mode emit without changing internal state", () => {
    const onOpenChange = vi.fn();
    const card = new PreviewCard({ open: false, onOpenChange });
    card.onBeforeMount?.();
    card.openCard();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(card.isOpen).toBe(false);

    const card2 = new PreviewCard({ open: true, onOpenChange });
    card2.onBeforeMount?.();
    card2.closeCard();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(card2.isOpen).toBe(true);
  });

  it("openWithDelay() cancels a pending close timer", () => {
    const card = new PreviewCard({ defaultOpen: true, openDelay: 0, closeDelay: 100 });
    card.onBeforeMount?.();
    card.closeWithDelay();
    card.openWithDelay();
    vi.advanceTimersByTime(100);
    // The pending close was cancelled, so the card should still be open.
    expect(card.isOpen).toBe(true);
  });

  it("closeWithDelay() cancels a pending open timer", () => {
    const card = new PreviewCard({ openDelay: 100, closeDelay: 0 });
    card.onBeforeMount?.();
    card.openWithDelay();
    card.closeWithDelay();
    vi.advanceTimersByTime(100);
    // The pending open was cancelled, so the card should still be closed.
    expect(card.isOpen).toBe(false);
  });
});

describe("PreviewCardTrigger", () => {
  it("renders attributes and registers itself with the card on mount", async () => {
    const card = new PreviewCard({ openDelay: 0 });
    card.onBeforeMount?.();
    const container = mount(() => (
      <PreviewCardTrigger card={card} id="trig" class="tc">
        Hover me
      </PreviewCardTrigger>
    ));
    const span = container.querySelector("#trig") as HTMLElement;
    expect(span.className).toBe("tc");
    expect(span.getAttribute("aria-describedby")).toBe(card.contentId);
    await Promise.resolve();
    expect((card as unknown as { _triggerEl: HTMLElement | null })._triggerEl).toBe(span);
  });

  it("opens on mouseenter/focus (after the delay) and closes on mouseleave/blur", () => {
    const card = new PreviewCard({ openDelay: 0, closeDelay: 0 });
    card.onBeforeMount?.();
    const container = mount(() => <PreviewCardTrigger card={card}>Hover</PreviewCardTrigger>);
    const span = container.querySelector("span") as HTMLElement;

    span.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(0);
    expect(card.isOpen).toBe(true);

    span.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    vi.advanceTimersByTime(0);
    expect(card.isOpen).toBe(false);

    span.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    vi.advanceTimersByTime(0);
    expect(card.isOpen).toBe(true);

    span.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
    vi.advanceTimersByTime(0);
    expect(card.isOpen).toBe(false);
  });
});

describe("PreviewCardContent", () => {
  it("renders nothing while closed", () => {
    const card = new PreviewCard();
    card.onBeforeMount?.();
    mount(() => <PreviewCardContent card={card}>x</PreviewCardContent>);
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });

  it("portals a positioned card into document.body when open", () => {
    const card = new PreviewCard({ defaultOpen: true });
    card.onBeforeMount?.();
    mount(() => (
      <PreviewCardContent card={card} id="pc-1" class="cc">
        <span>content</span>
      </PreviewCardContent>
    ));
    const el = document.querySelector('[role="tooltip"]') as HTMLElement;
    expect(el.id).toBe("pc-1");
    expect(el.className).toBe("cc");
    expect(el.getAttribute("data-open")).toBe("");
    expect(el.parentElement?.style.position).toBe("fixed");
  });

  it("falls back to card.contentId when no id is given", () => {
    const card = new PreviewCard({ defaultOpen: true });
    card.onBeforeMount?.();
    mount(() => <PreviewCardContent card={card} />);
    const el = document.querySelector('[role="tooltip"]') as HTMLElement;
    expect(el.id).toBe(card.contentId);
  });

  it("uses a neutral position when the card has no computed position", () => {
    const card = new PreviewCard({ defaultOpen: true });
    card.onBeforeMount?.();
    mount(() => <PreviewCardContent card={card} />);
    const el = document.querySelector('[role="tooltip"]') as HTMLElement;
    const wrapper = el.parentElement as HTMLElement;
    expect(wrapper.style.top).toBe("0px");
    expect(wrapper.style.left).toBe("0px");
    expect(wrapper.style.transform).toBe("none");
  });

  it("mouseenter on the content keeps it open, mouseleave closes it after the delay", () => {
    const card = new PreviewCard({ defaultOpen: true, closeDelay: 50 });
    card.onBeforeMount?.();
    mount(() => <PreviewCardContent card={card} />);
    const el = document.querySelector('[role="tooltip"]') as HTMLElement;

    el.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    expect(card.isOpen).toBe(true);

    el.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    expect(card.isOpen).toBe(true);
    vi.advanceTimersByTime(50);
    expect(card.isOpen).toBe(false);
  });
});
