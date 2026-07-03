/** Edge of the anchor element the floating content is placed against. */
export type AnchorSide = "top" | "bottom" | "left" | "right";

/** Alignment of the floating content along the anchor's perpendicular axis. */
export type AnchorAlign = "start" | "center" | "end";

export interface AnchorPositionOptions {
  /** Which edge of the anchor to place the content against. @default "bottom" */
  side?: AnchorSide;
  /** Alignment along the anchor's perpendicular axis. @default "start" */
  align?: AnchorAlign;
  /** Gap in pixels between the anchor and the content. @default 4 */
  offset?: number;
}

export interface AnchorPosition {
  /** `top` value for a `position: fixed` element, in viewport pixels. */
  top: number;
  /** `left` value for a `position: fixed` element, in viewport pixels. */
  left: number;
  /** CSS transform that finishes the alignment without measuring the content element. */
  transform: string;
}

/**
 * Computes a `position: fixed` placement for floating content anchored to a
 * trigger element, without needing to measure the content itself — alignment
 * is finished with a CSS transform instead.
 *
 * Used by components that render their content through a `Portal` (so it's no
 * longer a DOM sibling of the trigger) but still need it visually anchored to it,
 * e.g. `Dropdown`, `Tooltip`, `Popover`, `PreviewCard`, `Menubar`.
 */
export function computeAnchorPosition(
  anchor: Element,
  options: AnchorPositionOptions = {},
): AnchorPosition {
  const { side = "bottom", align = "start", offset = 4 } = options;
  const rect = anchor.getBoundingClientRect();

  let top: number;
  let left: number;
  let transformX = "0";
  let transformY = "0";

  if (side === "top" || side === "bottom") {
    top = side === "top" ? rect.top - offset : rect.bottom + offset;
    if (side === "top") transformY = "-100%";

    if (align === "start") {
      left = rect.left;
    } else if (align === "center") {
      left = rect.left + rect.width / 2;
      transformX = "-50%";
    } else {
      left = rect.right;
      transformX = "-100%";
    }
  } else {
    left = side === "left" ? rect.left - offset : rect.right + offset;
    if (side === "left") transformX = "-100%";

    if (align === "start") {
      top = rect.top;
    } else if (align === "center") {
      top = rect.top + rect.height / 2;
      transformY = "-50%";
    } else {
      top = rect.bottom;
      transformY = "-100%";
    }
  }

  return { top, left, transform: `translate(${transformX}, ${transformY})` };
}
