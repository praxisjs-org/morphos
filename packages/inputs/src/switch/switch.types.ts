import type { PrimitiveProps } from "@morphos/core";

export interface SwitchProps extends PrimitiveProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  name?: string;
  value?: string;
  onCheckedChange?: (checked: boolean) => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}
