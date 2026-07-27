export { Icon } from "./icon/icon";
export type { IconProps } from "./icon/icon.types";

export { IconProvider } from "./provider/icon-provider";

export { getIconProvider, setIconProvider } from "./provider/provider-store";
export type { IconProviderName } from "./provider/provider-store";

export { IconInstance } from "./provider/icon-instance";

export type { IconData, IconNode, IconResolver } from "./provider/registry";

export { IconSource } from "./provider/icon-source";
export { RegisterIconProvider } from "./provider/register-icon-provider";
export type { RegisteredIconSource } from "./provider/register-icon-provider";
export { iconsFromGlob } from "./provider/icons-from-glob";

export { LucideSource } from "./data/lucide-source";
export type { LucideIconName } from "./data/lucide";
