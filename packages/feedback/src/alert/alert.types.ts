import type { PrimitiveProps } from "@morphos/core";

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps extends PrimitiveProps {
  variant?: AlertVariant;
  /** Set to "assertive" for urgent alerts (e.g. errors). Defaults to "polite". */
  live?: "polite" | "assertive";
  title?: string;
}
