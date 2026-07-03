import type { PrimitiveProps } from "@morphos/core";

import type { ContextMenu } from "./context-menu";

export interface ContextMenuProps extends PrimitiveProps {
  onOpenChange?: (open: boolean) => void;
}

export interface ContextMenuTriggerProps extends PrimitiveProps {
  contextMenu: ContextMenu;
}

export interface ContextMenuContentProps extends PrimitiveProps {
  contextMenu: ContextMenu;
  "aria-label"?: string;
}

export interface ContextMenuItemProps extends PrimitiveProps {
  contextMenu: ContextMenu;
  value: string;
  label?: string;
  disabled?: boolean;
  onSelect?: () => void;
}
