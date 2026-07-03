import type { PrimitiveProps } from "@morphos/core";

import type { ToastProvider } from "./toast";

export type ToastVariant = "info" | "success" | "warning" | "error";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  /** Duration in ms before auto-dismiss. Set to 0 to disable auto-dismiss. */
  duration?: number;
}

export interface ToastProviderProps extends PrimitiveProps {
  /** Default duration for all toasts in ms. Defaults to 5000. */
  defaultDuration?: number;
}

export interface ToastProps extends PrimitiveProps {
  toast: ToastItem;
  provider: ToastProvider;
}
