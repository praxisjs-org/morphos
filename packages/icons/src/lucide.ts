import type { LucideIconName } from "./data/lucide";

export { LucideSource } from "./data/lucide-source";
export type { LucideIconName } from "./data/lucide";

// Importing this entry (which any app using LucideSource does) makes lucide's names autocomplete on `Icon`.
declare module "./icon/icon.types" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface IconNameRegistry extends Record<LucideIconName, unknown> {}
}
