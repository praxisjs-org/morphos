// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@praxisjs/runtime";

import { Icon } from "../icon/icon";
// Registers "lucide", same as any consumer applying @IconProvider(LucideSource) would —
// there's no implicit default, Icon needs some provider actually registered.
import "../data/lucide-source";
import { IconSource } from "../provider/icon-source";
import { resetIconProvider, setIconProvider } from "../provider/provider-store";
import { RegisterIconProvider } from "../provider/register-icon-provider";
import { registerIconProvider, unregisterIconProvider } from "../provider/registry";
import type { IconData } from "../provider/registry";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

function mountDisposable(node: () => unknown): { container: HTMLDivElement; dispose: () => void } {
  const container = document.createElement("div");
  const dispose = render(node as () => Node, container);
  return { container, dispose };
}

// Simulates an app that already applied @IconProvider(LucideSource) — there's no
// implicit default, so every test in this file configures it explicitly, same as a
// real consumer must.
beforeEach(() => {
  setIconProvider("lucide");
});

afterEach(() => {
  resetIconProvider();
});

describe("Icon", () => {
  it("resolves against lucide once it's configured as the provider", () => {
    const container = mount(() => <Icon name="Plus" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
    expect(svg?.getAttribute("fill")).toBe("none");
    expect(svg?.getAttribute("stroke")).toBe("currentColor");
    expect(svg?.querySelectorAll("path").length).toBe(2);
  });

  it("an inline provider overrides the active default", () => {
    registerIconProvider("brand", (name) =>
      name === "Logo" ? { svg: '<svg viewBox="0 0 32 32"><path d="M1"/></svg>' } : undefined,
    );
    setIconProvider("brand");
    try {
      const container = mount(() => <Icon name="Plus" provider="lucide" />);
      expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe("0 0 24 24");
    } finally {
      unregisterIconProvider("brand");
    }
  });

  it("warns and renders nothing for an unknown name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const container = mount(() => <Icon name="NotARealIconName123" />);
    expect(container.querySelector("svg")).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it("applies size and color", () => {
    const container = mount(() => <Icon name="Plus" size={32} color="tomato" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("32");
    expect(svg?.getAttribute("height")).toBe("32");
    expect(svg?.getAttribute("stroke")).toBe("tomato");
  });

  it("scales strokeWidth with absoluteStrokeWidth so it stays visually constant", () => {
    const container = mount(() => <Icon name="Plus" size={48} strokeWidth={2} absoluteStrokeWidth />);
    // 2 * 24 / 48 = 1
    expect(container.querySelector("svg")?.getAttribute("stroke-width")).toBe("1");
  });

  it("is aria-hidden by default and exposed as an img when aria-label is set", () => {
    const hidden = mount(() => <Icon name="Plus" />);
    expect(hidden.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");

    const labeled = mount(() => <Icon name="Plus" aria-label="Add" />);
    const svg = labeled.querySelector("svg");
    expect(svg?.getAttribute("role")).toBe("img");
    expect(svg?.getAttribute("aria-label")).toBe("Add");
  });

  describe("custom providers", () => {
    afterEach(() => {
      unregisterIconProvider("brand");
    });

    it("resolves a registered custom provider, reading viewBox/fill from a full <svg> string", () => {
      registerIconProvider("brand", (name) =>
        name === "Logo"
          ? { svg: '<svg viewBox="0 0 32 32" fill="currentColor"><path d="M1"/></svg>' }
          : undefined,
      );
      const container = mount(() => <Icon name="Logo" provider="brand" />);
      const svg = container.querySelector("svg");
      expect(svg?.getAttribute("viewBox")).toBe("0 0 32 32");
      expect(svg?.getAttribute("fill")).toBe("currentColor");
      expect(svg?.querySelector("path")?.getAttribute("d")).toBe("M1");
    });

    it("resolves bare inner markup paired with an explicit viewBox", () => {
      registerIconProvider("brand", (name) =>
        name === "Logo" ? { svg: '<path d="M2"/>', viewBox: "0 0 16 16" } : undefined,
      );
      const container = mount(() => <Icon name="Logo" provider="brand" />);
      const svg = container.querySelector("svg");
      expect(svg?.getAttribute("viewBox")).toBe("0 0 16 16");
      expect(svg?.querySelector("path")?.getAttribute("d")).toBe("M2");
    });

    it("warns and renders nothing for a provider that was never registered", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
      const container = mount(() => <Icon name="Logo" provider="brand" />);
      expect(container.querySelector("svg")).toBeNull();
      expect(warn).toHaveBeenCalledTimes(1);
      warn.mockRestore();
    });

    it("warns and renders nothing when the registered resolver returns undefined for that name", () => {
      registerIconProvider("brand", () => undefined);
      const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
      const container = mount(() => <Icon name="Missing" provider="brand" />);
      expect(container.querySelector("svg")).toBeNull();
      expect(warn).toHaveBeenCalledTimes(1);
      warn.mockRestore();
    });

    it("follows setIconProvider for a custom provider name too", () => {
      registerIconProvider("brand", (name) => (name === "Logo" ? { svg: '<path d="M3"/>' } : undefined));
      setIconProvider("brand");
      const container = mount(() => <Icon name="Logo" />);
      expect(container.querySelector("path")?.getAttribute("d")).toBe("M3");
    });

    it("resolves through an @RegisterIconProvider-decorated class", () => {
      @RegisterIconProvider("brand")
      class BrandIcons extends IconSource {
        resolve(name: string): IconData | undefined {
          return name === "Logo" ? { svg: '<path d="M4"/>' } : undefined;
        }
      }
      void BrandIcons;

      const container = mount(() => <Icon name="Logo" provider="brand" />);
      expect(container.querySelector("path")?.getAttribute("d")).toBe("M4");
    });

    it("resolves structured node data ({ nodes }) the same way lucide itself does", () => {
      registerIconProvider("brand", (name) =>
        name === "Logo" ? { nodes: [["path", { d: "M5" }]], viewBox: "0 0 32 32" } : undefined,
      );
      const container = mount(() => <Icon name="Logo" provider="brand" />);
      const svg = container.querySelector("svg");
      expect(svg?.getAttribute("viewBox")).toBe("0 0 32 32");
      expect(svg?.querySelector("path")?.getAttribute("d")).toBe("M5");
    });

    it("renders every supported structured shape tag, skipping unrecognized ones", () => {
      registerIconProvider("brand", (name) =>
        name === "Logo"
          ? {
              nodes: [
                ["circle", { cx: "12", cy: "12", r: "10" }],
                ["rect", { x: "3", y: "3", width: "18", height: "18" }],
                ["line", { x1: "0", y1: "0", x2: "24", y2: "24" }],
                ["polyline", { points: "0,0 12,24 24,0" }],
                ["ellipse", { cx: "12", cy: "12", rx: "10", ry: "6" }],
                ["title", { id: "unsupported" }],
              ],
              viewBox: "0 0 24 24",
            }
          : undefined,
      );
      const container = mount(() => <Icon name="Logo" provider="brand" />);
      const svg = container.querySelector("svg");
      expect(svg?.querySelector("circle")?.getAttribute("r")).toBe("10");
      expect(svg?.querySelector("rect")?.getAttribute("width")).toBe("18");
      expect(svg?.querySelector("line")?.getAttribute("x2")).toBe("24");
      expect(svg?.querySelector("polyline")?.getAttribute("points")).toBe("0,0 12,24 24,0");
      expect(svg?.querySelector("ellipse")?.getAttribute("rx")).toBe("10");
      expect(svg?.querySelector("title")).toBeNull();
    });

    it("defaults viewBox for structured node data with no explicit viewBox", () => {
      registerIconProvider("brand", (name) =>
        name === "Logo" ? { nodes: [["path", { d: "M6" }]] } : undefined,
      );
      const container = mount(() => <Icon name="Logo" provider="brand" />);
      expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe("0 0 24 24");
    });

    it("labels a raw-markup icon as an img when aria-label is set", () => {
      registerIconProvider("brand", (name) =>
        name === "Logo" ? { svg: '<svg viewBox="0 0 32 32"><path d="M1"/></svg>' } : undefined,
      );
      const container = mount(() => <Icon name="Logo" provider="brand" aria-label="Brand" />);
      const svg = container.querySelector("svg");
      expect(svg?.getAttribute("role")).toBe("img");
      expect(svg?.getAttribute("aria-label")).toBe("Brand");
      expect(svg?.getAttribute("aria-hidden")).toBeNull();
    });

    it("cleans up without throwing when unmounted, for both structured and raw-markup icons", async () => {
      registerIconProvider("brand", (name) =>
        name === "Logo" ? { nodes: [["path", { d: "M7" }]] } : undefined,
      );
      const nodesIcon = mountDisposable(() => <Icon name="Logo" provider="brand" />);
      await Promise.resolve();
      expect(() => { nodesIcon.dispose(); }).not.toThrow();

      registerIconProvider("brand", (name) =>
        name === "Logo" ? { svg: '<path d="M8"/>' } : undefined,
      );
      const markupIcon = mountDisposable(() => <Icon name="Logo" provider="brand" />);
      await Promise.resolve();
      expect(() => { markupIcon.dispose(); }).not.toThrow();
    });
  });
});
