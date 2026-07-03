// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render } from "@praxisjs/runtime";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../accordion/accordion";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("Accordion render", () => {
  it("renders the root with id, class and data-type", () => {
    const container = mount(() => (
      <Accordion id="acc" class="ac" type="multiple">
        <div>child</div>
      </Accordion>
    ));
    const root = container.firstElementChild as HTMLElement;
    expect(root.id).toBe("acc");
    expect(root.className).toBe("ac");
    expect(root.getAttribute("data-type")).toBe("multiple");
    expect(root.textContent).toBe("child");
  });

  it("defaults type to single", () => {
    const container = mount(() => <Accordion>content</Accordion>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute("data-type")).toBe("single");
  });

  it("AccordionItem reflects expanded/disabled state", () => {
    const accordion = new Accordion({ type: "single", defaultValue: "a" });
    accordion.onBeforeMount?.();
    const container = mount(() => (
      <AccordionItem accordion={accordion} value="a" id="item-a" class="ia">
        <span>A</span>
      </AccordionItem>
    ));
    const item = container.querySelector("#item-a") as HTMLElement;
    expect(item.className).toBe("ia");
    expect(item.getAttribute("data-expanded")).toBe("");
    expect(item.hasAttribute("data-disabled")).toBe(false);
  });

  it("AccordionItem shows data-disabled when disabled is set", () => {
    const accordion = new Accordion({ type: "single" });
    accordion.onBeforeMount?.();
    const container = mount(() => (
      <AccordionItem accordion={accordion} value="a" disabled>
        <span>A</span>
      </AccordionItem>
    ));
    const item = container.firstElementChild as HTMLElement;
    expect(item.getAttribute("data-disabled")).toBe("");
    expect(item.hasAttribute("data-expanded")).toBe(false);
  });

  it("AccordionTrigger toggles the accordion on click and reflects aria/data state", () => {
    const accordion = new Accordion({ type: "single" });
    accordion.onBeforeMount?.();
    const container = mount(() => (
      <AccordionTrigger accordion={accordion} item="a" id="trig-a" class="ta">
        Toggle
      </AccordionTrigger>
    ));
    const btn = container.querySelector("#trig-a") as HTMLButtonElement;
    expect(btn.className).toBe("ta");
    expect(btn.type).toBe("button");
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    expect(btn.hasAttribute("data-expanded")).toBe(false);

    btn.click();
    expect(accordion.isOpen("a")).toBe(true);
    expect(btn.getAttribute("aria-expanded")).toBe("true");
    expect(btn.getAttribute("data-expanded")).toBe("");
  });

  it("AccordionTrigger falls back to a generated id when none is given, and exposes contentId", () => {
    const accordion = new Accordion({ type: "single" });
    accordion.onBeforeMount?.();
    const trigger = new AccordionTrigger({ accordion, item: "a" });
    expect(trigger.contentId).toMatch(/accordion-content/);
    const container = mount(() => (
      <AccordionTrigger accordion={accordion} item="a">
        Toggle
      </AccordionTrigger>
    ));
    const btn = container.querySelector("button") as HTMLButtonElement;
    expect(btn.id).toMatch(/accordion-trigger/);
  });

  it("AccordionTrigger toggles via Enter/Space and ignores other keys", () => {
    const accordion = new Accordion({ type: "single" });
    accordion.onBeforeMount?.();
    const container = mount(() => (
      <AccordionTrigger accordion={accordion} item="a">
        Toggle
      </AccordionTrigger>
    ));
    const btn = container.querySelector("button") as HTMLButtonElement;

    btn.dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true }));
    expect(accordion.isOpen("a")).toBe(false);

    btn.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    expect(accordion.isOpen("a")).toBe(true);

    btn.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true }));
    expect(accordion.isOpen("a")).toBe(false);
  });

  it("AccordionContent is hidden when closed, visible when open, and reflects data-expanded", () => {
    const accordion = new Accordion({ type: "single", defaultValue: "a" });
    accordion.onBeforeMount?.();
    const container = mount(() => (
      <AccordionContent accordion={accordion} item="a" id="content-a" class="ca">
        Body
      </AccordionContent>
    ));
    const content = container.querySelector("#content-a") as HTMLElement;
    expect(content.className).toBe("ca");
    expect(content.getAttribute("role")).toBe("region");
    expect(content.hidden).toBe(false);
    expect(content.getAttribute("data-expanded")).toBe("");

    accordion.toggle("a");
    expect(content.hidden).toBe(true);
    expect(content.hasAttribute("data-expanded")).toBe(false);
  });

  it("in controlled mode (value set), toggling emits without changing isOpen", () => {
    const onValueChange = vi.fn();
    const accordion = new Accordion({ type: "single", value: "a", onValueChange });
    accordion.onBeforeMount?.();
    accordion.toggle("b");
    expect(onValueChange).toHaveBeenCalledWith("b");
    expect(accordion.isOpen("a")).toBe(true);
    expect(accordion.isOpen("b")).toBe(false);
  });

  it("in controlled multiple mode, toggling emits the next array without changing isOpen", () => {
    const onValueChange = vi.fn();
    const accordion = new Accordion({ type: "multiple", value: ["a"], onValueChange });
    accordion.onBeforeMount?.();
    accordion.toggle("b");
    expect(onValueChange).toHaveBeenCalledWith(["a", "b"]);
    expect(accordion.isOpen("b")).toBe(false);
  });

  it("collapsing to undefined in single mode does not emit onValueChange", () => {
    const onValueChange = vi.fn();
    const accordion = new Accordion({ type: "single", collapsible: true, onValueChange });
    accordion.onBeforeMount?.();
    accordion.toggle("a");
    onValueChange.mockClear();
    accordion.toggle("a");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(accordion.isOpen("a")).toBe(false);
  });
});
