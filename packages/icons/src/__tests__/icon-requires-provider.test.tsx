// @vitest-environment jsdom
//
// Deliberately does NOT import "../data/lucide-source" (directly or via
// @IconProvider) anywhere in this file — proving Icon has no implicit
// default provider. A real app must apply @IconProvider(LucideSource) (or a
// custom source) before any icon, including a built-in lucide one, resolves.
import { describe, expect, it, vi } from "vitest";
import { render } from "@praxisjs/runtime";

import { Icon } from "../icon/icon";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("Icon without any registered provider", () => {
  it("warns naming @IconProvider and renders nothing, instead of silently using lucide", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const container = mount(() => <Icon name="Plus" />);
    expect(container.querySelector("svg")).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toMatch(/@IconProvider/);
    warn.mockRestore();
  });
});
