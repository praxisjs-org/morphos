import { iconsFromGlob } from "./icons-from-glob";

import type { IconData } from "./registry";

/**
 * Base class for an icon provider registered via `@RegisterIconProvider` — `"lucide"`
 * is implemented the same way, by `LucideSource`, so this is the one abstraction every
 * provider (built-in or your own) goes through.
 *
 * `defaultIcons` is whatever `@RegisterIconProvider` was given as its second
 * argument — a plain `{ name: svg }` map, or a Vite `import.meta.glob(...)`
 * result (raw or via the `@morphos/icons/vite` plugin) — normalized through
 * `iconsFromGlob` either way, so file-path keys and plain names both work.
 *
 * The default `resolve` just looks `name` up in `defaultIcons`; override it for
 * anything beyond a flat name → SVG map (aliases, structured node data like lucide's,
 * a remote fallback, ...), and call `super.resolve(name)` to fall back to it.
 */
export abstract class IconSource {
  protected readonly defaultIcons: Record<string, string>;

  constructor(defaultIcons: Record<string, string> = {}) {
    this.defaultIcons = iconsFromGlob(defaultIcons);
  }

  resolve(name: string): IconData | undefined {
    return Object.hasOwn(this.defaultIcons, name) ? { svg: this.defaultIcons[name] } : undefined;
  }
}
