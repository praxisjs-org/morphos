import type { PrimitiveProps } from "@morphos/core";

import type { Toolbar } from "./toolbar";

export interface ToolbarProps extends PrimitiveProps {
  orientation?: "horizontal" | "vertical";
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export interface ToolbarButtonProps extends PrimitiveProps {
  toolbar: Toolbar;
  disabled?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
}

export interface ToolbarSeparatorProps extends PrimitiveProps {
  toolbar: Toolbar;
}
