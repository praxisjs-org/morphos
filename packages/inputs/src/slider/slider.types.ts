import type { PrimitiveProps } from "@morphos/core";

export interface SliderProps extends PrimitiveProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  name?: string;
  orientation?: "horizontal" | "vertical";
  onValueChange?: (value: number) => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}
