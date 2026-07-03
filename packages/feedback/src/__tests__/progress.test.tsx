// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@praxisjs/runtime";

import { Progress } from "../progress/progress";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("Progress render", () => {
  it("renders a determinate progressbar with value/percentage attributes", () => {
    const container = mount(() => (
      <Progress value={25} min={0} max={50} id="p1" class="pr" aria-label="al" aria-labelledby="alb" />
    ));
    const bar = container.querySelector('[role="progressbar"]') as HTMLElement;
    expect(bar.id).toBe("p1");
    expect(bar.className).toBe("pr");
    expect(bar.getAttribute("aria-label")).toBe("al");
    expect(bar.getAttribute("aria-labelledby")).toBe("alb");
    expect(bar.getAttribute("aria-valuemin")).toBe("0");
    expect(bar.getAttribute("aria-valuemax")).toBe("50");
    expect(bar.getAttribute("aria-valuenow")).toBe("25");
    expect(bar.getAttribute("aria-valuetext")).toBe("50%");
    expect(bar.hasAttribute("data-indeterminate")).toBe(false);
    expect(bar.getAttribute("data-value")).toBe("25");
    expect(bar.style.getPropertyValue("--progress")).toBe("50%");
  });

  it("renders indeterminate state when value is unset", () => {
    const container = mount(() => <Progress />);
    const bar = container.querySelector('[role="progressbar"]') as HTMLElement;
    expect(bar.hasAttribute("aria-valuenow")).toBe(false);
    expect(bar.hasAttribute("aria-valuetext")).toBe(false);
    expect(bar.getAttribute("data-indeterminate")).toBe("");
    expect(bar.hasAttribute("data-value")).toBe(false);
  });
});
