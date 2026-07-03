import type { PrimitiveProps } from "@morphos/core";

export interface NumberFieldProps extends PrimitiveProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  formatOptions?: Intl.NumberFormatOptions;
  onValueChange?: (value: number) => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}
