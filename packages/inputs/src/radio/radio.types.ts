import type { PrimitiveProps } from "@morphos/core";

import type { RadioGroup } from "./radio-group";

export interface RadioGroupProps extends PrimitiveProps {
  value?: string;
  defaultValue?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  orientation?: "horizontal" | "vertical";
  onValueChange?: (value: string) => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export interface RadioProps extends PrimitiveProps {
  value: string;
  /** The RadioGroup instance this radio belongs to. */
  group: RadioGroup;
  disabled?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}
