import type { PrimitiveProps } from "@morphos/core";

export interface FormProps extends PrimitiveProps {
  action?: string;
  method?: "get" | "post";
  noValidate?: boolean;
  onSubmit?: (event: SubmitEvent) => void;
  onReset?: (event: Event) => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}
