import type { PrimitiveProps } from "@morphos/core";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps extends PrimitiveProps {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  filterFn?: (option: ComboboxOption, query: string) => boolean;
  onValueChange?: (value: string) => void;
  onQueryChange?: (query: string) => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}
