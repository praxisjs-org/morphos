import type { AnchorAlign, AnchorSide, PrimitiveProps } from "@morphos/core";

import type { PreviewCard } from "./preview-card";

export interface PreviewCardProps extends PrimitiveProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
  /** Which edge of the trigger the card is placed against. @default "bottom" */
  side?: AnchorSide;
  /** Alignment of the card along the trigger's perpendicular axis. @default "start" */
  align?: AnchorAlign;
  /** Gap in pixels between the trigger and the card. @default 4 */
  sideOffset?: number;
}

export interface PreviewCardTriggerProps extends PrimitiveProps {
  card: PreviewCard;
}

export interface PreviewCardContentProps extends PrimitiveProps {
  card: PreviewCard;
}
