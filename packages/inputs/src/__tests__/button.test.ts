import { describe, it, expect } from "vitest";

import { Button } from "../button/button";

describe("Button", () => {
  it("is a class", () => {
    expect(typeof Button).toBe("function");
  });

  it("can be instantiated with no props", () => {
    const btn = new Button();
    expect(btn).toBeInstanceOf(Button);
  });

  it("defaults type to button", () => {
    const btn = new Button({ type: undefined });
    expect(btn.props.type).toBeUndefined();
  });

  it("reflects disabled state via props", () => {
    const btn = new Button({ disabled: true });
    expect(btn.props.disabled).toBe(true);
  });
});
