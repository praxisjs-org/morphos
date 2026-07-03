import type { PrimitiveProps } from "@morphos/core";

export interface InputProps extends PrimitiveProps {
  type?: "text" | "email" | "password" | "number" | "search" | "tel" | "url";
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  invalid?: boolean;
  name?: string;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  onInput?: (value: string, event: Event) => void;
  onChange?: (value: string, event: Event) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}
