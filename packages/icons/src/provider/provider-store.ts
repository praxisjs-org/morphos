import type { LiteralUnion } from "@praxisjs/jsx";

/** `"lucide"` is the built-in provider name (`LucideSource`); any other string is a custom provider registered via `RegisterIconProvider`. */
export type IconProviderName = LiteralUnion<"lucide">;

/**
 * No provider is configured until `IconProvider` (or `setIconProvider`) sets one — there is no
 * implicit default, `"lucide"` included. `LucideSource` is just a pre-configured `IconSource`;
 * an app that wants it still has to apply `@IconProvider(LucideSource)` like any other provider.
 */
let currentProvider: IconProviderName | undefined;

/** Sets the icon library used by every `<Icon>` that doesn't pass its own `provider` prop. */
export function setIconProvider(provider: IconProviderName): void {
  currentProvider = provider;
}

/** The currently configured default icon library, or `undefined` if `IconProvider`/`setIconProvider` hasn't run yet. */
export function getIconProvider(): IconProviderName | undefined {
  return currentProvider;
}

/** Clears the configured provider back to unset. Exported for test isolation between cases. */
export function resetIconProvider(): void {
  currentProvider = undefined;
}
