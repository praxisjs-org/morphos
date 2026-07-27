import { afterEach, describe, expect, it } from "vitest";

import { IconSource } from "../provider/icon-source";
import { RegisterIconProvider } from "../provider/register-icon-provider";
import { getIconResolver, unregisterIconProvider } from "../provider/registry";
import type { RegisteredIconSource } from "../provider/register-icon-provider";
import type { IconData } from "../provider/registry";

afterEach(() => {
  unregisterIconProvider("test-decorator");
});

describe("RegisterIconProvider", () => {
  it("registers the decorated class's resolve method under the given provider name", () => {
    @RegisterIconProvider("test-decorator")
    class Icons extends IconSource {
      resolve(name: string): IconData | undefined {
        return name === "Foo" ? { svg: '<path d="M1"/>' } : undefined;
      }
    }

    const resolver = getIconResolver("test-decorator");
    expect(resolver?.("Foo")).toEqual({ svg: '<path d="M1"/>' });
    expect(resolver?.("Bar")).toBeUndefined();
    // The decorator returns the class unchanged — it's still directly constructible.
    expect(new Icons().resolve("Foo")).toEqual({ svg: '<path d="M1"/>' });
  });

  it("instantiates the class once and preserves constructor-initialized instance state across calls", () => {
    @RegisterIconProvider("test-decorator")
    class Icons extends IconSource {
      private readonly data = new Map([["Foo", '<path d="from-constructor"/>']]);

      resolve(name: string): IconData | undefined {
        const svg = this.data.get(name);
        return svg ? { svg } : undefined;
      }
    }
    void Icons;

    const resolver = getIconResolver("test-decorator");
    expect(resolver?.("Foo")).toEqual({ svg: '<path d="from-constructor"/>' });
  });

  it("passes defaultIcons through to the constructor, usable via the inherited resolve", () => {
    @RegisterIconProvider("test-decorator", { Logo: '<path d="M1"/>', Mark: '<path d="M2"/>' })
    class Icons extends IconSource {}
    void Icons;

    const resolver = getIconResolver("test-decorator");
    expect(resolver?.("Logo")).toEqual({ svg: '<path d="M1"/>' });
    expect(resolver?.("Mark")).toEqual({ svg: '<path d="M2"/>' });
    expect(resolver?.("Missing")).toBeUndefined();
  });

  it("an overridden resolve can fall back to the inherited defaultIcons lookup via super.resolve", () => {
    @RegisterIconProvider("test-decorator", { Logo: '<path d="M1"/>' })
    class Icons extends IconSource {
      resolve(name: string): IconData | undefined {
        if (name === "Alias") return { svg: '<path d="aliased"/>' };
        return super.resolve(name);
      }
    }
    void Icons;

    const resolver = getIconResolver("test-decorator");
    expect(resolver?.("Alias")).toEqual({ svg: '<path d="aliased"/>' });
    expect(resolver?.("Logo")).toEqual({ svg: '<path d="M1"/>' });
    expect(resolver?.("Missing")).toBeUndefined();
  });

  it("normalizes a raw import.meta.glob-shaped result (file-path keys) passed as defaultIcons", () => {
    @RegisterIconProvider("test-decorator", { "./icons/brand/logo.svg": '<path d="M1"/>' })
    class Icons extends IconSource {}
    void Icons;

    expect(getIconResolver("test-decorator")?.("logo")).toEqual({ svg: '<path d="M1"/>' });
  });

  it("throws a clear error when given a glob path string that the vite plugin didn't transform", () => {
    expect(() => {
      @RegisterIconProvider("test-decorator", "./icons/brand/*.svg")
      class Icons extends IconSource {}
      void Icons;
    }).toThrow(/@morphos\/icons\/vite/);
  });

  it("tags the decorated class with __iconProviderName, so IconProvider can read it back", () => {
    @RegisterIconProvider("test-decorator")
    class Icons extends IconSource {}

    expect((Icons as unknown as RegisteredIconSource).__iconProviderName).toBe("test-decorator");
  });
});
