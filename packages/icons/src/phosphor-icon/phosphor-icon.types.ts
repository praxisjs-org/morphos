import type { CSSProperties } from "@praxisjs/jsx";

export interface PhosphorIconProps {
  /**
   * Raw SVG markup for one weight, e.g. from `@phosphor-icons/core`:
   * `import plusRegular from "@phosphor-icons/core/assets/regular/plus.svg?raw"`.
   */
  svg: string;
  /** Applied to both `width` and `height`. Defaults to `24`. */
  size?: number | string;
  /** Sets the SVG `color` attribute, which the asset's `fill="currentColor"` resolves against. */
  color?: string;
  /** Flips the icon horizontally. Defaults to `false`. */
  mirrored?: boolean;
  style?: string | CSSProperties;
  class?: string;
  id?: string;
  /** Accessible name. When set, the icon gets `role="img"`; otherwise it's `aria-hidden`. */
  "aria-label"?: string;
}
