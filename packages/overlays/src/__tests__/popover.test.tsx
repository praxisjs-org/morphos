// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@praxisjs/runtime";

import { Popover, PopoverTrigger, PopoverContent } from "../popover/popover";

afterEach(() => {
  document.body.innerHTML = "";
});

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  render(node as () => Node, container);
  return container;
}

describe("Popover", () => {
  it("renders its children when used as a JSX wrapper", () => {
    const container = mount(() => (
      <Popover>
        <span>wrapped</span>
      </Popover>
    ));
    expect(container.textContent).toBe("wrapped");
  });

  it("toggle()/closePopover() in controlled mode emit without changing internal state", () => {
    const onOpenChange = vi.fn();
    const popover = new Popover({ open: false, onOpenChange });
    popover.onBeforeMount?.();
    popover.toggle();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(popover.isOpen).toBe(false);

    const popover2 = new Popover({ open: true, onOpenChange });
    popover2.onBeforeMount?.();
    popover2.closePopover();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(popover2.isOpen).toBe(true);
  });
});

describe("PopoverTrigger", () => {
  it("renders attributes, registers itself with the popover, and toggles on click", async () => {
    const popover = new Popover();
    popover.onBeforeMount?.();
    const container = mount(() => (
      <PopoverTrigger popover={popover} id="trig" class="tc">
        Open
      </PopoverTrigger>
    ));
    const btn = container.querySelector("#trig") as HTMLButtonElement;
    expect(btn.className).toBe("tc");
    expect(btn.getAttribute("aria-haspopup")).toBe("true");
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    expect(btn.getAttribute("aria-controls")).toBe(popover.contentId);
    expect(btn.hasAttribute("data-open")).toBe(false);

    btn.click();
    expect(popover.isOpen).toBe(true);
    expect(btn.getAttribute("aria-expanded")).toBe("true");
    expect(btn.getAttribute("data-open")).toBe("");

    await Promise.resolve();
    expect(popover._triggerEl).toBe(btn);

    btn.click();
    expect(popover.isOpen).toBe(false);
  });
});

describe("PopoverContent", () => {
  it("renders nothing while closed", () => {
    const popover = new Popover();
    popover.onBeforeMount?.();
    mount(() => <PopoverContent popover={popover}>x</PopoverContent>);
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it("portals a positioned content into document.body when open", async () => {
    const popover = new Popover({ defaultOpen: true });
    popover.onBeforeMount?.();
    mount(() => (
      <PopoverContent popover={popover} id="pc-1" class="c" aria-label="al" aria-labelledby="alb">
        <span>hi</span>
      </PopoverContent>
    ));
    await Promise.resolve();
    const content = document.querySelector('[role="dialog"]') as HTMLElement;
    expect(content.id).toBe("pc-1");
    expect(content.className).toBe("c");
    expect(content.getAttribute("aria-label")).toBe("al");
    expect(content.getAttribute("aria-labelledby")).toBe("alb");
    expect(content.getAttribute("data-open")).toBe("");
    expect(content.parentElement?.style.position).toBe("fixed");
  });

  it("falls back to popover.contentId when no id is given", async () => {
    const popover = new Popover({ defaultOpen: true });
    popover.onBeforeMount?.();
    mount(() => <PopoverContent popover={popover} />);
    await Promise.resolve();
    const content = document.querySelector('[role="dialog"]') as HTMLElement;
    expect(content.id).toBe(popover.contentId);
  });

  it("uses a neutral position when the popover has no computed position", async () => {
    const popover = new Popover({ defaultOpen: true });
    popover.onBeforeMount?.();
    mount(() => <PopoverContent popover={popover} />);
    await Promise.resolve();
    const content = document.querySelector('[role="dialog"]') as HTMLElement;
    const wrapper = content.parentElement as HTMLElement;
    expect(wrapper.style.top).toBe("0px");
    expect(wrapper.style.left).toBe("0px");
    expect(wrapper.style.transform).toBe("none");
  });

  it("Escape closes the popover when closeOnEscape is true (default)", async () => {
    const popover = new Popover({ defaultOpen: true });
    popover.onBeforeMount?.();
    mount(() => <PopoverContent popover={popover} />);
    await Promise.resolve();
    const content = document.querySelector('[role="dialog"]') as HTMLElement;
    content.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(popover.isOpen).toBe(false);
  });

  it("Escape does nothing when closeOnEscape is false", async () => {
    const popover = new Popover({ defaultOpen: true, closeOnEscape: false });
    popover.onBeforeMount?.();
    mount(() => <PopoverContent popover={popover} />);
    await Promise.resolve();
    const content = document.querySelector('[role="dialog"]') as HTMLElement;
    content.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(popover.isOpen).toBe(true);
  });

  it("other keys do not close the popover", async () => {
    const popover = new Popover({ defaultOpen: true });
    popover.onBeforeMount?.();
    mount(() => <PopoverContent popover={popover} />);
    await Promise.resolve();
    const content = document.querySelector('[role="dialog"]') as HTMLElement;
    content.dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true }));
    expect(popover.isOpen).toBe(true);
  });

  it("mousedown outside the content and trigger closes the popover when closeOnOutsideClick is true (default)", async () => {
    const popover = new Popover({ defaultOpen: true });
    popover.onBeforeMount?.();
    mount(() => <PopoverContent popover={popover} />);
    await Promise.resolve();
    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(popover.isOpen).toBe(false);
  });

  it("mousedown inside the content does not close the popover", async () => {
    const popover = new Popover({ defaultOpen: true });
    popover.onBeforeMount?.();
    mount(() => (
      <PopoverContent popover={popover}>
        <span>inner</span>
      </PopoverContent>
    ));
    await Promise.resolve();
    const inner = document.querySelector("span") as HTMLElement;
    inner.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(popover.isOpen).toBe(true);
  });

  it("mousedown inside the registered trigger does not close the popover", async () => {
    const popover = new Popover();
    popover.onBeforeMount?.();
    const container = mount(() => (
      <>
        <PopoverTrigger popover={popover}>Trigger</PopoverTrigger>
        <PopoverContent popover={popover} />
      </>
    ));
    await Promise.resolve();
    const trigger = container.querySelector("button") as HTMLButtonElement;
    trigger.click();
    expect(popover.isOpen).toBe(true);
    trigger.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(popover.isOpen).toBe(true);
  });

  it("mousedown outside does nothing when closeOnOutsideClick is false", async () => {
    const popover = new Popover({ defaultOpen: true, closeOnOutsideClick: false });
    popover.onBeforeMount?.();
    mount(() => <PopoverContent popover={popover} />);
    await Promise.resolve();
    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(popover.isOpen).toBe(true);
  });

  it("unmount removes the document mousedown listener without throwing", async () => {
    const popover = new Popover();
    popover.onBeforeMount?.();
    const container = document.createElement("div");
    document.body.appendChild(container);
    const dispose = render(() => <PopoverContent popover={popover} />, container);
    await Promise.resolve();
    expect(() => { dispose(); }).not.toThrow();
    expect(() => {
      document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    }).not.toThrow();
  });
});
