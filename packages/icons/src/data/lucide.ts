import { icons as lucideIcons } from "lucide";

export { lucideIcons };

/** Every valid `name` for the `"lucide"` provider — derived directly from the `lucide` package's own exports. */
export type LucideIconName = keyof typeof lucideIcons;
