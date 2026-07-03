import type { PrimitiveProps } from "@morphos/core";

export interface OtpFieldProps extends PrimitiveProps {
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  pattern?: string;
  inputMode?: "numeric" | "text";
  "aria-label"?: string;
}
