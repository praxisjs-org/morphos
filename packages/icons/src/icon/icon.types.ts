import type { CSSProperties, LiteralUnion } from "@praxisjs/jsx";

import type { IconProviderName } from "../provider/provider-store";

/**
 * Icon names that get autocompleted on `Icon`'s `name`. Empty on its own; an icon set adds its
 * names by augmenting this interface — importing `@morphos/icons/lucide` adds lucide's.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IconNameRegistry {}

export interface IconProps {
  /**
   * Icon name. Valid values depend on the resolved provider — lucide's export names, or
   * whatever a custom provider registered via `RegisterIconProvider` expects. Any string is
   * accepted; known names (see `IconNameRegistry`) are autocompleted.
   */
  name: LiteralUnion<Extract<keyof IconNameRegistry, string>>;
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
