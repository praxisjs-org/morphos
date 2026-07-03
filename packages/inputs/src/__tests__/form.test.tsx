// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render } from "@praxisjs/runtime";

import { Form } from "../form/form";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("Form", () => {
  it("renders a form element with the given attributes", () => {
    const container = mount(() => (
      <Form
        id="f-1"
        class="frm"
        action="/submit"
        method="post"
        noValidate
        aria-label="al"
        aria-labelledby="alb"
        aria-describedby="adb"
      >
        <input />
      </Form>
    ));
    const form = container.querySelector("form");
    expect(form?.id).toBe("f-1");
    expect(form?.className).toBe("frm");
    expect(form?.getAttribute("action")).toBe("/submit");
    expect(form?.getAttribute("method")).toBe("post");
    expect(form?.noValidate).toBe(true);
    expect(form?.getAttribute("aria-label")).toBe("al");
    expect(form?.getAttribute("aria-labelledby")).toBe("alb");
    expect(form?.getAttribute("aria-describedby")).toBe("adb");
    expect(form?.querySelector("input")).toBeTruthy();
  });

  it("fires onSubmit and onReset handlers", () => {
    const onSubmit = vi.fn();
    const onReset = vi.fn();
    const container = mount(() => <Form onSubmit={onSubmit} onReset={onReset} />);
    const form = container.querySelector("form");
    form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    form?.dispatchEvent(new Event("reset", { bubbles: true, cancelable: true }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("renders without optional props", () => {
    const container = mount(() => <Form>plain</Form>);
    const form = container.querySelector("form");
    expect(form?.textContent).toBe("plain");
  });
});
