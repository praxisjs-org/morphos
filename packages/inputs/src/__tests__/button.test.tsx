// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render } from "@praxisjs/runtime";

import { Button } from "../button/button";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("Button", () => {
  it("renders a <button type=button> by default", () => {
    const container = mount(() => (
      <Button id="b1" class="btn" aria-label="al" tabIndex={2}>
        Click
      </Button>
    ));
    const btn = container.querySelector("button") as HTMLButtonElement;
    expect(btn.id).toBe("b1");
    expect(btn.type).toBe("button");
    expect(btn.className).toBe("btn");
    expect(btn.getAttribute("aria-label")).toBe("al");
    expect(btn.tabIndex).toBe(2);
    expect(btn.textContent).toBe("Click");
    expect(btn.hasAttribute("href")).toBe(false);
    expect(btn.hasAttribute("data-disabled")).toBe(false);
  });

  it("respects an explicit type", () => {
    const container = mount(() => <Button type="submit">Submit</Button>);
    expect((container.querySelector("button") as HTMLButtonElement).type).toBe("submit");
  });

  it("disabled sets the native disabled attribute and data-disabled, without aria-disabled", () => {
    const container = mount(() => <Button disabled>Click</Button>);
    const btn = container.querySelector("button") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.getAttribute("data-disabled")).toBe("");
    expect(btn.hasAttribute("aria-disabled")).toBe(false);
  });

  it("fires onClick", () => {
    const onClick = vi.fn();
    const container = mount(() => <Button onClick={onClick}>Click</Button>);
    (container.querySelector("button") as HTMLButtonElement).click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders as an <a> when as='a', with href and no button-only attributes", () => {
    const container = mount(() => (
      <Button as="a" href="/docs" id="l1" class="lnk">
        Docs
      </Button>
    ));
    const a = container.querySelector("a") as HTMLAnchorElement;
    expect(a.id).toBe("l1");
    expect(a.className).toBe("lnk");
    expect(a.getAttribute("href")).toBe("/docs");
    expect(a.hasAttribute("type")).toBe(false);
    expect(a.hasAttribute("disabled")).toBe(false);
  });

  it("a disabled link gets aria-disabled=true and data-disabled instead of the disabled attribute", () => {
    const container = mount(() => (
      <Button as="a" href="/docs" disabled>
        Docs
      </Button>
    ));
    const a = container.querySelector("a") as HTMLAnchorElement;
    expect(a.getAttribute("aria-disabled")).toBe("true");
    expect(a.getAttribute("data-disabled")).toBe("");
    expect(a.hasAttribute("disabled")).toBe(false);
  });

  it("a non-disabled link has no aria-disabled", () => {
    const container = mount(() => <Button as="a" href="/docs">Docs</Button>);
    expect(container.querySelector("a")?.hasAttribute("aria-disabled")).toBe(false);
  });

  it("supports toggle/menu aria attributes", () => {
    const container = mount(() => (
      <Button aria-pressed="true" aria-expanded="false" aria-controls="menu-1" aria-haspopup="menu">
        Toggle
      </Button>
    ));
    const btn = container.querySelector("button");
    expect(btn?.getAttribute("aria-pressed")).toBe("true");
    expect(btn?.getAttribute("aria-expanded")).toBe("false");
    expect(btn?.getAttribute("aria-controls")).toBe("menu-1");
    expect(btn?.getAttribute("aria-haspopup")).toBe("menu");
  });
});
