import type { AnchorAlign, AnchorSide, PrimitiveProps } from "@morphos/core";

import type { Popover } from "./popover";

export interface PopoverProps extends PrimitiveProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  /** Which edge of the trigger the popover is placed against. @default "bottom" */
  side?: AnchorSide;
  /** Alignment of the popover along the trigger's perpendicular axis. @default "start" */
  align?: AnchorAlign;
  /** Gap in pixels between the trigger and the popover. @default 4 */
  sideOffset?: number;
}

export interface PopoverTriggerProps extends PrimitiveProps {
  popover: Popover;
}

export interface PopoverContentProps extends PrimitiveProps {
  popover: Popover;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}
