import type { PrimitiveProps } from "@morphos/core";

import type { Dialog } from "./dialog";

export interface DialogProps extends PrimitiveProps {
  /** Controlled open state. When set, the consumer owns the state. */
  open?: boolean;
  /** Initial open state in uncontrolled mode. */
  defaultOpen?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Whether pressing Escape closes the dialog. Defaults to true. */
  closeOnEscape?: boolean;
  /** Whether clicking the backdrop closes the dialog. Defaults to true. */
  closeOnBackdropClick?: boolean;
}

export interface DialogTriggerProps extends PrimitiveProps {
  /** The Dialog instance this trigger controls. */
  dialog: Dialog;
}

export interface DialogContentProps extends PrimitiveProps {
  /** The Dialog instance this content belongs to. */
  dialog: Dialog;
  /** ARIA label for the dialog element. Use when no DialogTitle is present. */
  "aria-label"?: string;
  /** ID of the element that labels the dialog (e.g. a DialogTitle). */
  "aria-labelledby"?: string;
  /** ID of the element that describes the dialog (e.g. a DialogDescription). */
  "aria-describedby"?: string;
}

export interface DialogTitleProps extends PrimitiveProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export type DialogDescriptionProps = PrimitiveProps;

export interface DialogCloseProps extends PrimitiveProps {
  /** The Dialog instance this close button controls. */
  dialog: Dialog;
}
