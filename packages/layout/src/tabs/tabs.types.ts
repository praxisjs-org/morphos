import type { Orientation, PrimitiveProps } from "@morphos/core";

import type { Tabs } from "./tabs";

export interface TabsProps extends PrimitiveProps {
  value?: string;
  defaultValue?: string;
  orientation?: Orientation;
  onValueChange?: (value: string) => void;
}

export interface TabListProps extends PrimitiveProps {
  tabs: Tabs;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export interface TabProps extends PrimitiveProps {
  tabs: Tabs;
  value: string;
  disabled?: boolean;
}

export interface TabPanelProps extends PrimitiveProps {
  tabs: Tabs;
  value: string;
}
