import { registerIconProvider } from "./registry";

import type { IconSource } from "./icon-source";

/** What `RegisterIconProvider` tags the decorated class with — lets `IconProvider` read the provider name straight off the class. */
export interface RegisteredIconSource {
  readonly __iconProviderName: string;
}

/**
 * Class-decorator form of `registerIconProvider`. Applied to an `IconSource`
 * subclass, it instantiates the class once (at decoration time), passing
 * `defaultIcons` through to its constructor, registers its `resolve` method
 * under `provider`, and tags the class with that name so it can be passed
 * directly to `IconProvider`.
 *
 * With the `@morphos/icons/vite` plugin wired into `vite.config.ts`, the
 * second argument can be a glob path directly:
 *
 * ```tsx
 * @RegisterIconProvider("brand", "./icons/brand/*.svg")
 * class BrandIcons extends IconSource {}
 * ```
 *
 * The plugin rewrites that string into `import.meta.glob(...)` at build time —
 * `RegisterIconProvider` itself never sees a path, only the resolved icons.
 * Without the plugin, pass a `{ name: svg }` map (or a glob result) directly.
 *
 * Override `resolve` on the class only if `defaultIcons` alone isn't enough.
 */
export function RegisterIconProvider(provider: string, defaultIcons: Record<string, string> | string = {}) {
  return function <T extends new (defaultIcons?: Record<string, string>) => IconSource>(
    constructor: T,
    _context: ClassDecoratorContext,
  ): T & RegisteredIconSource {
    if (typeof defaultIcons === "string") {
      throw new Error(
        `[@morphos/icons] RegisterIconProvider("${provider}", "${defaultIcons}") received a glob ` +
          `path, but nothing turned it into icon data. Add the @morphos/icons/vite plugin to your ` +
          `vite.config.ts, or pass a { name: svg } map / import.meta.glob(...) result directly instead.`,
      );
    }
    const instance = new constructor(defaultIcons);
    registerIconProvider(provider, (name) => instance.resolve(name));
    Object.defineProperty(constructor, "__iconProviderName", {
      value: provider,
      writable: false,
      configurable: false,
    });
    return constructor as T & RegisteredIconSource;
  };
}
