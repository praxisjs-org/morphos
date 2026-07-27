import { afterEach, describe, expect, it } from "vitest";

import { IconInstance } from "../provider/icon-instance";
import { getIconProvider, resetIconProvider } from "../provider/provider-store";

afterEach(() => {
  resetIconProvider();
});

describe("IconInstance", () => {
  it("setup() exposes a snapshot of the current provider — undefined until one is configured", () => {
    const view = new IconInstance().setup();
    expect(view.provider).toBeUndefined();
  });

  it("setProvider changes the global provider, same as setIconProvider", () => {
    const view = new IconInstance().setup();
    view.setProvider("brand");
    expect(getIconProvider()).toBe("brand");
  });

  it("provider is a snapshot, not a live binding — a later setProvider doesn't change it", () => {
    const view = new IconInstance().setup();
    expect(view.provider).toBeUndefined();
    view.setProvider("brand");
    expect(view.provider).toBeUndefined();
    expect(getIconProvider()).toBe("brand");
  });
});
