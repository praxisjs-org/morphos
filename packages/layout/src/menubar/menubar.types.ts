import type { AnchorAlign, AnchorSide, PrimitiveProps } from "@morphos/core";

import type { Menubar, MenubarMenu } from "./menubar";

export interface MenubarProps extends PrimitiveProps {
  "aria-label"?: string;
}

export interface MenubarMenuProps extends PrimitiveProps {
  menubar: Menubar;
  value: string;
  /** Which edge of the trigger the menu is placed against. @default "bottom" */
  side?: AnchorSide;
  /** Alignment of the menu along the trigger's perpendicular axis. @default "start" */
  align?: AnchorAlign;
  /** Gap in pixels between the trigger and the menu. @default 4 */
  sideOffset?: number;
}

export interface MenubarTriggerProps extends PrimitiveProps {
  menu: MenubarMenu;
}

export interface MenubarContentProps extends PrimitiveProps {
  menu: MenubarMenu;
}

export interface MenubarItemProps extends PrimitiveProps {
  menu: MenubarMenu;
  value?: string;
  label?: string;
  disabled?: boolean;
  onSelect?: () => void;
}

export type MenubarSeparatorProps = PrimitiveProps;
