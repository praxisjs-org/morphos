import type { PrimitiveProps } from "@morphos/core";

export interface ToggleProps extends PrimitiveProps {
  pressed?: boolean;
  defaultPressed?: boolean;
  disabled?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}
