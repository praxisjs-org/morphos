import type { PrimitiveProps } from "@morphos/core";

export interface ButtonProps extends PrimitiveProps {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
  /** Renders the button as a different HTML element (e.g. "a" for link-buttons). */
  as?: "button" | "a" | "span" | "div";
  href?: string;
  tabIndex?: number;
  "aria-label"?: string;
  "aria-pressed"?: boolean;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  "aria-haspopup"?: boolean | "menu" | "listbox" | "dialog";
}
