import type { CSSProperties, LiteralUnion } from "@praxisjs/jsx";

import type { LucideIconName } from "../data/lucide";
import type { IconProviderName } from "../provider/provider-store";

export interface IconProps {
  /**
   * Icon name. Valid values depend on the resolved provider — lucide's export names, or
   * whatever a custom provider registered via `RegisterIconProvider` expects.
   */
  name: LiteralUnion<LucideIconName>;
  /** Overrides the configured `IconProvider` for just this icon. Required somewhere — via this prop or `IconProvider` — there's no default. */
  provider?: IconProviderName;
  /** Applied to both `width` and `height`. Defaults to `24`. */
  size?: number | string;
  /** Sets the icon's color (`stroke` for lucide). Defaults to `currentColor`. */
  color?: string;
  /** `"lucide"` only. Defaults to `2`. */
  strokeWidth?: number | string;
  /** `"lucide"` only. Scales `strokeWidth` so the visual stroke thickness stays constant across sizes. Defaults to `false`. */
  absoluteStrokeWidth?: boolean;
  style?: string | CSSProperties;
  class?: string;
  id?: string;
  /** Accessible name. When set, the icon gets `role="img"`; otherwise it's `aria-hidden`. */
  "aria-label"?: string;
}
