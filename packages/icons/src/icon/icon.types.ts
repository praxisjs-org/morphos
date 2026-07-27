import type { CSSProperties } from "@praxisjs/jsx";

export interface IconProps {
  /**
   * Raw SVG markup: either a full `<svg>...</svg>` string (its outer tag and
   * `viewBox` are read and stripped automatically) or bare inner markup
   * (`<path .../>`), in which case `viewBox` is used as-is.
   */
  svg: string;
  /** Used when `svg` is bare inner markup and carries no `viewBox` of its own. */
  viewBox?: string;
  /** Applied to both `width` and `height`. */
  size?: number | string;
  /** Sets the SVG `color` attribute, which `currentColor` fills/strokes resolve against. */
  color?: string;
  style?: string | CSSProperties;
  class?: string;
  id?: string;
  /** Accessible name. When set, the icon gets `role="img"`; otherwise it's `aria-hidden`. */
  "aria-label"?: string;
}
