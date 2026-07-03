import { describe, expect, it } from "vitest";

import { Meter } from "../meter/meter.js";

describe("Meter", () => {
  it("computes percentage correctly", () => {
    const m = new Meter({ value: 50, min: 0, max: 100 });
    expect(m.percentage).toBe(50);
  });

  it("computes percentage with non-zero min", () => {
    const m = new Meter({ value: 75, min: 50, max: 100 });
    expect(m.percentage).toBe(50);
  });

  it("clamps percentage at 100", () => {
    const m = new Meter({ value: 120, min: 0, max: 100 });
    expect(m.percentage).toBe(120);
  });

  it("isLow when value is below low threshold", () => {
    const m = new Meter({ value: 10, min: 0, max: 100, low: 20 });
    expect(m.isLow).toBe(true);
    expect(m.isHigh).toBe(false);
  });

  it("isLow is false when low is not set", () => {
    const m = new Meter({ value: 10, min: 0, max: 100 });
    expect(m.isLow).toBe(false);
  });

  it("isHigh when value is above high threshold", () => {
    const m = new Meter({ value: 90, min: 0, max: 100, high: 80 });
    expect(m.isHigh).toBe(true);
    expect(m.isLow).toBe(false);
  });

  it("isHigh is false when high is not set", () => {
    const m = new Meter({ value: 90, min: 0, max: 100 });
    expect(m.isHigh).toBe(false);
  });

  it("isOptimum when value matches optimum", () => {
    const m = new Meter({ value: 90, min: 0, max: 100, optimum: 90 });
    expect(m.isOptimum).toBe(true);
  });

  it("isOptimum is false when value differs from optimum", () => {
    const m = new Meter({ value: 85, min: 0, max: 100, optimum: 90 });
    expect(m.isOptimum).toBe(false);
  });

  it("neither isLow nor isHigh when value is in the normal range", () => {
    const m = new Meter({ value: 55, min: 0, max: 100, low: 20, high: 80 });
    expect(m.isLow).toBe(false);
    expect(m.isHigh).toBe(false);
  });
});
