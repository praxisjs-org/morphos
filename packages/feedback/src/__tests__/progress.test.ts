import { describe, it, expect } from "vitest";
import { signal } from "@praxisjs/core/internal";

import { Progress } from "../progress/progress";

describe("Progress", () => {
  it("is a class", () => {
    expect(typeof Progress).toBe("function");
  });

  it("can be instantiated", () => {
    const p = new Progress({ value: 50 });
    expect(p).toBeInstanceOf(Progress);
  });

  it("accepts an indeterminate state (no value)", () => {
    const p = new Progress({});
    expect(p.value).toBeUndefined();
  });

  it("accepts min and max", () => {
    const p = new Progress({ value: 25, min: 0, max: 50 });
    expect(p.min).toBe(0);
    expect(p.max).toBe(50);
    expect(p.value).toBe(25);
  });

  it("isIndeterminate is true when value is undefined", () => {
    const p = new Progress({});
    expect(p.isIndeterminate).toBe(true);
  });

  it("isIndeterminate is false when value is set", () => {
    const p = new Progress({ value: 50 });
    expect(p.isIndeterminate).toBe(false);
  });

  it("percentage computes from value/min/max", () => {
    const p = new Progress({ value: 25, min: 0, max: 50 });
    expect(p.percentage).toBe(50);
  });

  it("percentage is undefined when indeterminate", () => {
    const p = new Progress({});
    expect(p.percentage).toBeUndefined();
  });

  it("percentage tracks a reactive value getter passed by the parent", () => {
    const value = signal(10);
    const p = new Progress({ value: () => value(), min: 0, max: 100 });
    expect(p.percentage).toBe(10);
    value.set(60);
    expect(p.percentage).toBe(60);
  });
});
