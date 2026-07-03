import type { AnchorAlign, AnchorSide, PrimitiveProps } from "@morphos/core";

import type { Dropdown } from "./dropdown";

export interface DropdownItem {
  value: string;
  label: string;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface DropdownProps extends PrimitiveProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnSelect?: boolean;
  /** Which edge of the trigger the menu is placed against. @default "bottom" */
  side?: AnchorSide;
  /** Alignment of the menu along the trigger's perpendicular axis. @default "start" */
  align?: AnchorAlign;
  /** Gap in pixels between the trigger and the menu. @default 4 */
  sideOffset?: number;
}

export interface DropdownTriggerProps extends PrimitiveProps {
  dropdown: Dropdown;
  "aria-label"?: string;
}

export interface DropdownMenuProps extends PrimitiveProps {
  dropdown: Dropdown;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export interface DropdownItemProps extends PrimitiveProps {
  dropdown: Dropdown;
  value: string;
  label?: string;
  disabled?: boolean;
  onSelect?: () => void;
}
