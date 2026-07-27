import { afterEach, describe, expect, it } from "vitest";

import { getIconResolver, registerIconProvider, unregisterIconProvider } from "../provider/registry";

afterEach(() => {
  unregisterIconProvider("test-provider");
});

describe("registry", () => {
  it("returns undefined for a provider that was never registered", () => {
    expect(getIconResolver("nope")).toBeUndefined();
  });

  it("registerIconProvider makes the resolver available via getIconResolver", () => {
    const resolver = (name: string) => (name === "Foo" ? { svg: "<path d=\"M1\"/>" } : undefined);
    registerIconProvider("test-provider", resolver);
    expect(getIconResolver("test-provider")).toBe(resolver);
  });

  it("re-registering the same provider name replaces the previous resolver", () => {
    registerIconProvider("test-provider", () => ({ svg: "<path d=\"first\"/>" }));
    registerIconProvider("test-provider", () => ({ svg: "<path d=\"second\"/>" }));
    expect(getIconResolver("test-provider")?.("Foo")).toEqual({ svg: '<path d="second"/>' });
  });

  it("unregisterIconProvider removes the resolver", () => {
    registerIconProvider("test-provider", () => ({ svg: "<path d=\"M1\"/>" }));
    unregisterIconProvider("test-provider");
    expect(getIconResolver("test-provider")).toBeUndefined();
  });
});
