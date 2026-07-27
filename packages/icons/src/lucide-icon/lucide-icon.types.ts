/** A single SVG child element, as `["tag", { attr: value }]` — Lucide's native icon data shape. */
export type IconNode = ReadonlyArray<readonly [tag: string, attrs: Record<string, string | number | undefined>]>;

export interface LucideIconProps {
  /** Icon node data, e.g. `import { Plus } from "lucide"` then `icon={Plus}`. */
  icon: IconNode;
  /** Applied to both `width` and `height`. Defaults to `24`. */
  size?: number | string;
  /** Sets `stroke`. Defaults to `currentColor`. */
  color?: string;
  /** Defaults to `2`. */
  strokeWidth?: number | string;
  /** Scales `strokeWidth` so the visual stroke thickness stays constant across sizes. Defaults to `false`. */
  absoluteStrokeWidth?: boolean;
  class?: string;
  id?: string;
  /** Accessible name. When set, the icon gets `role="img"`; otherwise it's `aria-hidden`. */
  "aria-label"?: string;
}
