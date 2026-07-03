import type { PrimitiveProps } from "@morphos/core";

import type { Disclosure } from "./disclosure";

export interface DisclosureProps extends PrimitiveProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface DisclosureTriggerProps extends PrimitiveProps {
  disclosure: Disclosure;
  "aria-label"?: string;
}

export interface DisclosureContentProps extends PrimitiveProps {
  disclosure: Disclosure;
}
