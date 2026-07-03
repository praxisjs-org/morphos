import type { PrimitiveProps } from "@morphos/core";

export interface FieldsetProps extends PrimitiveProps {
  disabled?: boolean;
  legend?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}
