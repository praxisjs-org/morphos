// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@praxisjs/runtime";

import { Spinner } from "../spinner/spinner";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("Spinner", () => {
  it("defaults aria-label to Loading", () => {
    const container = mount(() => <Spinner id="s1" class="sp" />);
    const spinner = container.querySelector('[role="status"]') as HTMLElement;
    expect(spinner.id).toBe("s1");
    expect(spinner.className).toBe("sp");
    expect(spinner.getAttribute("aria-label")).toBe("Loading");
    expect(spinner.getAttribute("aria-live")).toBe("polite");
    expect(spinner.getAttribute("aria-busy")).toBe("true");
  });

  it("supports a custom aria-label", () => {
    const container = mount(() => <Spinner aria-label="Fetching results" />);
    expect(container.querySelector('[role="status"]')?.getAttribute("aria-label")).toBe("Fetching results");
  });
});
