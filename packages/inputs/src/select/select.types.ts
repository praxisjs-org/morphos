import type { PrimitiveProps } from "@morphos/core";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends PrimitiveProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  clearable?: boolean;
  onValueChange?: (value: string) => void;
  onClear?: () => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}
