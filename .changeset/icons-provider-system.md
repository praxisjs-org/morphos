---
"@morphos/icons": major
---

Redesigned around a single `Icon` component that resolves icons by name, plus a provider system
for choosing which icon set `name` resolves against.

- **Breaking:** `LucideIcon` and `PhosphorIcon` are removed. `Icon`'s `svg`/`icon` prop is replaced
  by a typed `name`, resolved against the configured icon provider. `lucide` is now a peer
  dependency — its icon data is read live (`import { icons } from "lucide"`), no per-icon data
  wiring needed.

- **Breaking:** `IconProvider` is mandatory, in every app, with no exceptions. There is no default
  provider — `"lucide"` included. `Icon` logs a warning and renders nothing until `IconProvider`
  (or `setIconProvider`) configures one.

- `IconProvider` — a class decorator (same pattern as `@Router`), applied to the root component,
  that configures the app-wide provider:

  ```tsx
  @IconProvider(BrandIcons)
  @Component()
  class App extends StatefulComponent { ... }
  ```

  It takes an `IconSource` class directly, not a string — pass an array to register several at
  once, with the first becoming the default:

  ```tsx
  @IconProvider([BrandIcons, MarketingIcons])
  ```

  Runs at class-decoration time, before `App` is ever constructed. `setIconProvider`/
  `getIconProvider` do the same thing without decorating a class.

- `RegisterIconProvider` + `IconSource` — register a custom icon provider as a class,
  decorator-first, consistent with every other Morphos/PraxisJS component:

  ```tsx
  @RegisterIconProvider("brand", "./icons/brand/*.svg")
  class BrandIcons extends IconSource {}
  ```

  Instantiates the class once, registers its `resolve` method, and tags the class with the given
  name so `IconProvider` can read it back. The second argument, `defaultIcons`, can be a `{ name:
  svg }` map, a glob path string (with `@morphos/icons/vite`'s `iconsPlugin()` wired into
  `vite.config.ts` — it rewrites the path into `import.meta.glob(...)` at build time, the same
  source-text-rewrite technique `@praxisjs/content`'s own Vite plugin uses), or a glob result
  passed directly. `resolve`'s default implementation looks `name` up in `defaultIcons`; override
  it (calling `super.resolve(name)` to fall back) for anything more — aliases, a remote fallback,
  or structured `{ nodes, viewBox? }` data, the same `[tag, attrs][]` format `lucide` itself uses.

- `"lucide"` isn't special-cased anywhere: it's `LucideSource`, a built-in `IconSource` — a
  pre-configured wrapper around the `lucide` package, registered and activated the exact same way a
  custom provider is (`@IconProvider(LucideSource)`, never automatic). `Icon` renders any
  `nodes`-returning provider identically.

- `IconInstance` — a PraxisJS `Composable` wrapping `getIconProvider`/`setIconProvider`, for
  changing the provider from inside a component, same pattern as `@praxisjs/composables`'
  `WindowSize`:

  ```tsx
  @Component()
  class IconProviderSwitcher extends StatefulComponent {
    @Compose(IconInstance) iconInstance!: IconInstance

    render() {
      return <button onClick={() => this.iconInstance.setProvider("brand")}>Use brand icons</button>
    }
  }
  ```

- `provider` (on `Icon`/`setIconProvider`) and `Icon`'s `name` are typed as `LiteralUnion`s —
  autocomplete still suggests the known values, but any string is accepted, so custom provider
  names and their icon names type-check too.
