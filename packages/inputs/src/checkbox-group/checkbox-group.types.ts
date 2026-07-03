import type { PrimitiveProps } from "@morphos/core";

import type { CheckboxGroup } from "./checkbox-group";

export interface CheckboxGroupProps extends PrimitiveProps {
  value?: string[];
  defaultValue?: string[];
  disabled?: boolean;
  required?: boolean;
  name?: string;
  orientation?: "horizontal" | "vertical";
  onValueChange?: (value: string[]) => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

export interface CheckboxGroupItemProps extends PrimitiveProps {
  group: CheckboxGroup;
  value: string;
  disabled?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}
