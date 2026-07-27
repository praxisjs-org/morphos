import { afterEach, describe, expect, it } from "vitest";

import { getIconProvider, resetIconProvider, setIconProvider } from "../provider/provider-store";

describe("provider-store", () => {
  afterEach(() => {
    resetIconProvider();
  });

  it("has no provider configured until one is set — there's no implicit default", () => {
    expect(getIconProvider()).toBeUndefined();
  });

  it("setIconProvider changes the value returned by getIconProvider", () => {
    setIconProvider("brand");
    expect(getIconProvider()).toBe("brand");
  });

  it("resetIconProvider clears back to unconfigured, not to lucide", () => {
    setIconProvider("brand");
    resetIconProvider();
    expect(getIconProvider()).toBeUndefined();
  });
});
