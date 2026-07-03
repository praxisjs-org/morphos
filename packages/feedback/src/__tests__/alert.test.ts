import { describe, it, expect } from "vitest";

import { Alert } from "../alert/alert";

describe("Alert", () => {
  it("is a class", () => {
    expect(typeof Alert).toBe("function");
  });

  it("can be instantiated with a variant", () => {
    const a = new Alert({ variant: "error" });
    expect(a.props.variant).toBe("error");
  });

  it("defaults variant to info", () => {
    const a = new Alert({});
    expect(a.props.variant).toBeUndefined();
  });
});
