// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@praxisjs/runtime";

import { Tooltip, TooltipTrigger, TooltipContent } from "../tooltip/tooltip";

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

describe("Tooltip", () => {
  it("renders its children when used as a JSX wrapper", () => {
    const container = mount(() => (
      <Tooltip>
        <span>wrapped</span>
      </Tooltip>
    ));
    expect(container.textContent).toBe("wrapped");
  });

  it("show() before closeDelay elapses cancels a pending close", () => {
    const tooltip = new Tooltip({ openDelay: 0, closeDelay: 500 });
    tooltip.show();
    vi.advanceTimersByTime(0);
    expect(tooltip.isOpen).toBe(true);

    tooltip.hide();
    tooltip.show();
    vi.advanceTimersByTime(500);
    // The pending close was cancelled, so it should still be open.
    expect(tooltip.isOpen).toBe(true);
  });

  it("hide() with no pending open timer is a no-op guard, and still schedules the close", () => {
    const tooltip = new Tooltip({ closeDelay: 0 });
    tooltip.hide();
    vi.advanceTimersByTime(0);
    expect(tooltip.isOpen).toBe(false);
  });

  it("onUnmount cancels any pending open/close timers", () => {
    const tooltip = new Tooltip({ openDelay: 300 });
    tooltip.show();
    tooltip.onUnmount?.();
    vi.advanceTimersByTime(300);
    expect(tooltip.isOpen).toBe(false);
  });
});

describe("TooltipTrigger", () => {
  it("renders attributes, registers itself with the tooltip, and reflects data-open", async () => {
    const tooltip = new Tooltip({ openDelay: 0, closeDelay: 0 });
    const container = mount(() => (
      <TooltipTrigger tooltip={tooltip} id="trig" class="tc">
        Hover me
      </TooltipTrigger>
    ));
    const span = container.querySelector("#trig") as HTMLElement;
    expect(span.className).toBe("tc");
    expect(span.getAttribute("aria-describedby")).toBe(tooltip.contentId);
    expect(span.hasAttribute("data-open")).toBe(false);
    await Promise.resolve();
    expect((tooltip as unknown as { _triggerEl: HTMLElement | null })._triggerEl).toBe(span);
  });

  it("opens on mouseenter/focus (after the delay) and closes on mouseleave/blur", () => {
    const tooltip = new Tooltip({ openDelay: 0, closeDelay: 0 });
    const container = mount(() => <TooltipTrigger tooltip={tooltip}>Hover</TooltipTrigger>);
    const span = container.querySelector("span") as HTMLElement;

    span.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(0);
    expect(tooltip.isOpen).toBe(true);
    expect(span.getAttribute("data-open")).toBe("");

    span.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    vi.advanceTimersByTime(0);
    expect(tooltip.isOpen).toBe(false);
    expect(span.hasAttribute("data-open")).toBe(false);

    span.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    vi.advanceTimersByTime(0);
    expect(tooltip.isOpen).toBe(true);

    span.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
    vi.advanceTimersByTime(0);
    expect(tooltip.isOpen).toBe(false);
  });
});

describe("TooltipContent", () => {
  it("renders nothing while closed", () => {
    const tooltip = new Tooltip();
    mount(() => <TooltipContent tooltip={tooltip}>x</TooltipContent>);
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });

  it("portals a positioned tooltip into document.body when open", () => {
    const tooltip = new Tooltip({ openDelay: 0 });
    mount(() => (
      <TooltipContent tooltip={tooltip} id="tt-1" class="cc" aria-label="al">
        content
      </TooltipContent>
    ));
    tooltip.show();
    vi.advanceTimersByTime(0);

    const el = document.querySelector('[role="tooltip"]') as HTMLElement;
    expect(el.id).toBe("tt-1");
    expect(el.className).toBe("cc");
    expect(el.getAttribute("aria-label")).toBe("al");
    expect(el.getAttribute("data-open")).toBe("");
    expect(el.parentElement?.style.position).toBe("fixed");
  });

  it("falls back to tooltip.contentId when no id is given", () => {
    const tooltip = new Tooltip({ openDelay: 0 });
    mount(() => <TooltipContent tooltip={tooltip} />);
    tooltip.show();
    vi.advanceTimersByTime(0);
    const el = document.querySelector('[role="tooltip"]') as HTMLElement;
    expect(el.id).toBe(tooltip.contentId);
  });

  it("uses a neutral position when the tooltip has no computed position", () => {
    const tooltip = new Tooltip({ openDelay: 0 });
    mount(() => <TooltipContent tooltip={tooltip} />);
    tooltip.show();
    vi.advanceTimersByTime(0);
    const el = document.querySelector('[role="tooltip"]') as HTMLElement;
    const wrapper = el.parentElement as HTMLElement;
    expect(wrapper.style.top).toBe("0px");
    expect(wrapper.style.left).toBe("0px");
    expect(wrapper.style.transform).toBe("none");
  });
});
