// @vitest-environment jsdom
import { StatefulComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import { render } from "@praxisjs/runtime";
import { afterEach, describe, expect, it } from "vitest";

import { Icon } from "../icon/icon";
import { LucideSource } from "../data/lucide-source";
import { IconProvider } from "../provider/icon-provider";
import { IconSource } from "../provider/icon-source";
import { getIconProvider, resetIconProvider } from "../provider/provider-store";
import { RegisterIconProvider } from "../provider/register-icon-provider";
import { registerIconProvider, unregisterIconProvider } from "../provider/registry";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

afterEach(() => {
  resetIconProvider();
  unregisterIconProvider("brand");
  unregisterIconProvider("marketing");
});

describe("IconProvider", () => {
  it("sets the provider as soon as the decorated class is declared, before it's ever instantiated", () => {
    @RegisterIconProvider("brand")
    class BrandIcons extends IconSource {}

    expect(getIconProvider()).toBeUndefined();

    @IconProvider(BrandIcons)
    @Component()
    class App extends StatefulComponent {
      render() {
        return document.createElement("div");
      }
    }

    expect(getIconProvider()).toBe("brand");
    void App;
  });

  it("a nested Icon inside the decorated root resolves against the provider it set", () => {
    @RegisterIconProvider("brand")
    class BrandIcons extends IconSource {
      resolve(name: string) {
        return name === "Logo" ? { svg: '<svg viewBox="0 0 32 32"><path d="M1"/></svg>' } : undefined;
      }
    }
    void BrandIcons;

    @IconProvider(BrandIcons)
    @Component()
    class App extends StatefulComponent {
      render() {
        return <Icon name="Logo" />;
      }
    }

    const container = mount(() => <App />);
    expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe("0 0 32 32");
  });

  it("accepts the built-in LucideSource directly, same as any custom IconSource", () => {
    @IconProvider(LucideSource)
    @Component()
    class App extends StatefulComponent {
      render() {
        return document.createElement("div");
      }
    }
    void App;

    expect(getIconProvider()).toBe("lucide");
  });

  it("given an array, registers every entry and sets the first as the app-wide default", () => {
    @RegisterIconProvider("brand")
    class BrandIcons extends IconSource {
      resolve(name: string) {
        return name === "Logo" ? { svg: '<path d="brand"/>' } : undefined;
      }
    }
    @RegisterIconProvider("marketing")
    class MarketingIcons extends IconSource {
      resolve(name: string) {
        return name === "Banner" ? { svg: '<path d="marketing"/>' } : undefined;
      }
    }

    @IconProvider([BrandIcons, MarketingIcons])
    @Component()
    class App extends StatefulComponent {
      render() {
        return (
          <>
            <Icon name="Logo" />
            <Icon name="Banner" provider="marketing" />
          </>
        );
      }
    }

    expect(getIconProvider()).toBe("brand");
    const container = mount(() => <App />);
    const paths = [...container.querySelectorAll("path")].map((p) => p.getAttribute("d"));
    expect(paths).toEqual(["brand", "marketing"]);
  });

  it("throws a clear error for a class that was never decorated with @RegisterIconProvider", () => {
    class Undecorated extends IconSource {}

    expect(() => {
      @IconProvider(Undecorated)
      @Component()
      class App extends StatefulComponent {
        render() {
          return document.createElement("div");
        }
      }
      void App;
    }).toThrow(/@RegisterIconProvider/);
  });

  it("throws when given an empty array", () => {
    expect(() => {
      @IconProvider([])
      @Component()
      class App extends StatefulComponent {
        render() {
          return document.createElement("div");
        }
      }
      void App;
    }).toThrow(/at least one IconSource/);
  });
});
