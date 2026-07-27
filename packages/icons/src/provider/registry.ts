/** A single `[tag, attrs]` shape, e.g. `["path", { d: "M1" }]` — the format `lucide` (and similarly-shaped icon sets) exports per icon. */
export type IconNode = ReadonlyArray<readonly [tag: string, attrs: Record<string, string | number | undefined>]>;

export type IconData =
  | {
      /**
       * Full `<svg>...</svg>` markup (its `viewBox`/`fill`/`stroke` are read off the
       * outer tag automatically) or bare inner markup, paired with `viewBox`.
       */
      svg: string;
      /** Used when `svg` is bare inner markup with no `viewBox` of its own. Defaults to `"0 0 24 24"`. */
      viewBox?: string;
    }
  | {
      /** Structured icon data — a lucide-style `[tag, attrs][]` node list, rendered as real SVG child elements. */
      nodes: IconNode;
      /** Defaults to `"0 0 24 24"`. */
      viewBox?: string;
    };

export type IconResolver = (name: string) => IconData | undefined;

const resolvers = new Map<string, IconResolver>();

/**
 * Registers an icon provider. `Icon` looks it up by `provider`/`IconProvider`
 * name whenever a name isn't found for the current provider — `"lucide"` is
 * registered the same way, by `LucideSource`, there's no separate built-in path.
 */
export function registerIconProvider(provider: string, resolver: IconResolver): void {
  resolvers.set(provider, resolver);
}

/** Removes a provider registered with `registerIconProvider`. */
export function unregisterIconProvider(provider: string): void {
  resolvers.delete(provider);
}

/** @internal Used by `Icon` to resolve the active (or an overridden) provider. */
export function getIconResolver(provider: string): IconResolver | undefined {
  return resolvers.get(provider);
}
