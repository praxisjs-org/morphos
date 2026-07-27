import { describe, expect, it } from "vitest";

import { resolveMarkup } from "../icon/resolve-markup";

describe("resolveMarkup", () => {
  it("strips a full <svg> wrapper and reads its viewBox", () => {
    const { markup, viewBox } = resolveMarkup(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M1"/></svg>',
      "0 0 24 24",
    );
    expect(viewBox).toBe("0 0 256 256");
    expect(markup).toBe('<path d="M1"/>');
  });

  it("preserves fill/stroke from the outer <svg> tag instead of discarding them with it", () => {
    const fillOnly = resolveMarkup(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M1"/></svg>',
      "0 0 24 24",
    );
    expect(fillOnly.fill).toBe("currentColor");
    expect(fillOnly.stroke).toBeUndefined();

    const strokeOnly = resolveMarkup(
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M1"/></svg>',
      "0 0 24 24",
    );
    expect(strokeOnly.fill).toBe("none");
    expect(strokeOnly.stroke).toBe("currentColor");
  });

  it("falls back to the given viewBox when svg has none", () => {
    const { markup, viewBox } = resolveMarkup("<svg><path d=\"M1\"/></svg>", "0 0 24 24");
    expect(viewBox).toBe("0 0 24 24");
    expect(markup).toBe('<path d="M1"/>');
  });

  it("treats bare inner markup as-is, with no fill/stroke to extract", () => {
    const { markup, viewBox, fill, stroke } = resolveMarkup('<path d="M1"/>', "0 0 24 24");
    expect(markup).toBe('<path d="M1"/>');
    expect(viewBox).toBe("0 0 24 24");
    expect(fill).toBeUndefined();
    expect(stroke).toBeUndefined();
  });
});
