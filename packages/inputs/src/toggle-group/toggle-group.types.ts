import type { PrimitiveProps } from "@morphos/core";

import type { ToggleGroup } from "./toggle-group";

export interface ToggleGroupProps extends PrimitiveProps {
  type: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  onValueChange?: (value: string | string[]) => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export interface ToggleGroupItemProps extends PrimitiveProps {
  group: ToggleGroup;
  value: string;
  disabled?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}
