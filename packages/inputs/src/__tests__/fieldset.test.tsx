// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@praxisjs/runtime";

import { Fieldset } from "../fieldset/fieldset";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("Fieldset", () => {
  it("renders with legend and children", () => {
    const container = mount(() => (
      <Fieldset legend="Personal info" id="fs-1" class="fs" aria-label="al" aria-labelledby="alb" aria-describedby="adb">
        <input />
      </Fieldset>
    ));
    const fieldset = container.querySelector("fieldset");
    expect(fieldset?.id).toBe("fs-1");
    expect(fieldset?.className).toBe("fs");
    expect(fieldset?.querySelector("legend")?.textContent).toBe("Personal info");
    expect(fieldset?.querySelector("input")).toBeTruthy();
    expect(fieldset?.getAttribute("aria-label")).toBe("al");
    expect(fieldset?.getAttribute("aria-labelledby")).toBe("alb");
    expect(fieldset?.getAttribute("aria-describedby")).toBe("adb");
  });

  it("renders without a legend", () => {
    const container = mount(() => <Fieldset>child</Fieldset>);
    expect(container.querySelector("legend")).toBeNull();
  });

  it("sets data-disabled and disabled attribute when disabled", () => {
    const container = mount(() => <Fieldset disabled>content</Fieldset>);
    const fieldset = container.querySelector("fieldset");
    expect(fieldset?.hasAttribute("disabled")).toBe(true);
    expect(fieldset?.getAttribute("data-disabled")).toBe("");
  });

  it("omits data-disabled when not disabled", () => {
    const container = mount(() => <Fieldset>content</Fieldset>);
    const fieldset = container.querySelector("fieldset");
    expect(fieldset?.hasAttribute("data-disabled")).toBe(false);
  });
});
