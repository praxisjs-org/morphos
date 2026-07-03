import type { PrimitiveProps } from "@morphos/core";

import type { Drawer } from "./drawer";

export type DrawerSide = "top" | "right" | "bottom" | "left";

export interface DrawerProps extends PrimitiveProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  side?: DrawerSide;
}

export interface DrawerTriggerProps extends PrimitiveProps {
  drawer: Drawer;
}

export interface DrawerContentProps extends PrimitiveProps {
  drawer: Drawer;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

export interface DrawerTitleProps extends PrimitiveProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export type DrawerDescriptionProps = PrimitiveProps;

export interface DrawerCloseProps extends PrimitiveProps {
  drawer: Drawer;
}
