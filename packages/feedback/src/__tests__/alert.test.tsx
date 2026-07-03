// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@praxisjs/runtime";

import { Alert } from "../alert/alert";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("Alert render", () => {
  it("defaults to variant=info, aria-live=polite, no title", () => {
    const container = mount(() => (
      <Alert id="a1" class="al">
        Saved successfully
      </Alert>
    ));
    const alert = container.querySelector('[role="alert"]');
    expect(alert?.id).toBe("a1");
    expect(alert?.className).toBe("al");
    expect(alert?.getAttribute("data-variant")).toBe("info");
    expect(alert?.getAttribute("aria-live")).toBe("polite");
    expect(alert?.getAttribute("aria-atomic")).toBe("true");
    expect(alert?.querySelector("strong")).toBeNull();
    expect(alert?.textContent).toBe("Saved successfully");
  });

  it("renders a title in a <strong> when provided", () => {
    const container = mount(() => <Alert title="Heads up">Details</Alert>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert?.querySelector("strong")?.textContent).toBe("Heads up");
  });

  it("error variant defaults aria-live to assertive", () => {
    const container = mount(() => <Alert variant="error">Failed</Alert>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert?.getAttribute("data-variant")).toBe("error");
    expect(alert?.getAttribute("aria-live")).toBe("assertive");
  });

  it("an explicit live prop overrides the variant-based default", () => {
    const container = mount(() => <Alert variant="error" live="polite">Softened</Alert>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert?.getAttribute("aria-live")).toBe("polite");
  });

  it("supports the other variants", () => {
    for (const variant of ["success", "warning"] as const) {
      const container = mount(() => <Alert variant={variant}>msg</Alert>);
      expect(container.querySelector('[role="alert"]')?.getAttribute("data-variant")).toBe(variant);
    }
  });
});
