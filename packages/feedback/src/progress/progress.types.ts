import type { PrimitiveProps } from "@morphos/core";

export interface ProgressProps extends PrimitiveProps {
  /** Current value. When undefined the progress is indeterminate. */
  value?: number;
  /** Maximum value. Defaults to 100. */
  max?: number;
  /** Minimum value. Defaults to 0. */
  min?: number;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}
