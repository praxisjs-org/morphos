import type { Children } from "@praxisjs/shared";

/** Props shared by every Morphē primitive. */
export interface PrimitiveProps {
  class?: string;
  children?: Children;
  id?: string;
}

/**
 * Map of data-* attributes used to expose component state to the consumer.
 * Values: `""` (present with no value), a string, or `undefined` (absent).
 */
export type DataAttributes = Record<string, string | undefined>;

/** Orientation used by components like Tabs and Accordion. */
export type Orientation = "horizontal" | "vertical";

/** Common size variants for primitive components. */
export type Size = "sm" | "md" | "lg";
