import type { AnchorAlign, AnchorSide, PrimitiveProps } from "@morphos/core";

import type { Tooltip } from "./tooltip";

export interface TooltipProps extends PrimitiveProps {
  /** Delay in ms before the tooltip appears on hover. Defaults to 500. */
  openDelay?: number;
  /** Delay in ms before the tooltip disappears. Defaults to 0. */
  closeDelay?: number;
  /** Which edge of the trigger the tooltip is placed against. @default "top" */
  side?: AnchorSide;
  /** Alignment of the tooltip along the trigger's perpendicular axis. @default "center" */
  align?: AnchorAlign;
  /** Gap in pixels between the trigger and the tooltip. @default 4 */
  sideOffset?: number;
}

export interface TooltipTriggerProps extends PrimitiveProps {
  tooltip: Tooltip;
}

export interface TooltipContentProps extends PrimitiveProps {
  tooltip: Tooltip;
  "aria-label"?: string;
}
