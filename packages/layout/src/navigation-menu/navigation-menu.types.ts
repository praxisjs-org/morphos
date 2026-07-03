import type { PrimitiveProps } from "@morphos/core";

import type { NavigationMenu, NavigationMenuItem } from "./navigation-menu";

export interface NavigationMenuProps extends PrimitiveProps {
  orientation?: "horizontal" | "vertical";
  "aria-label"?: string;
}

export interface NavigationMenuListProps extends PrimitiveProps {
  nav: NavigationMenu;
}

export interface NavigationMenuItemProps extends PrimitiveProps {
  nav: NavigationMenu;
  value: string;
}

export interface NavigationMenuTriggerProps extends PrimitiveProps {
  item: NavigationMenuItem;
}

export interface NavigationMenuContentProps extends PrimitiveProps {
  item: NavigationMenuItem;
}

export interface NavigationMenuLinkProps extends PrimitiveProps {
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (event: MouseEvent) => void;
}
