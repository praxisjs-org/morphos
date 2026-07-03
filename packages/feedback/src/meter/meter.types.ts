import type { PrimitiveProps } from "@morphos/core";

export interface MeterProps extends PrimitiveProps {
  value: number;
  min?: number;
  max?: number;
  low?: number;
  high?: number;
  optimum?: number;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}
