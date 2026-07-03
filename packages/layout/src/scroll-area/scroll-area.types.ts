import type { PrimitiveProps } from "@morphos/core";

import type { ScrollArea } from "./scroll-area";

export interface ScrollAreaProps extends PrimitiveProps {
  type?: "auto" | "always" | "scroll" | "hover" | "hidden";
}

export interface ScrollAreaViewportProps extends PrimitiveProps {
  scrollArea: ScrollArea;
}

export interface ScrollAreaScrollbarProps extends PrimitiveProps {
  scrollArea: ScrollArea;
  orientation?: "vertical" | "horizontal";
}

export interface ScrollAreaThumbProps extends PrimitiveProps {
  scrollArea?: ScrollArea;
  orientation?: "vertical" | "horizontal";
}
