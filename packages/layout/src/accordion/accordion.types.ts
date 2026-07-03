import type { PrimitiveProps } from "@morphos/core";

import type { Accordion } from "./accordion";

export interface AccordionProps extends PrimitiveProps {
  /** "single" allows only one item open at a time; "multiple" allows many. */
  type?: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  /** Whether an open item can be collapsed by clicking it again. Defaults to true. */
  collapsible?: boolean;
}

export interface AccordionItemProps extends PrimitiveProps {
  accordion: Accordion;
  value: string;
  disabled?: boolean;
}

export interface AccordionTriggerProps extends PrimitiveProps {
  accordion: Accordion;
  item: string;
}

export interface AccordionContentProps extends PrimitiveProps {
  accordion: Accordion;
  item: string;
}
