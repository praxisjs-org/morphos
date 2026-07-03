import type { PrimitiveProps } from "@morphos/core";

import type { AlertDialog } from "./alert-dialog";

export interface AlertDialogProps extends PrimitiveProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
}

export interface AlertDialogTriggerProps extends PrimitiveProps {
  alertDialog: AlertDialog;
}

export interface AlertDialogContentProps extends PrimitiveProps {
  alertDialog: AlertDialog;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

export interface AlertDialogTitleProps extends PrimitiveProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export type AlertDialogDescriptionProps = PrimitiveProps;

export interface AlertDialogActionProps extends PrimitiveProps {
  alertDialog: AlertDialog;
  onClick?: () => void;
}

export interface AlertDialogCancelProps extends PrimitiveProps {
  alertDialog: AlertDialog;
  onClick?: () => void;
}
