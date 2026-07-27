<div align="center">

<img src="assets/logo.svg" width="72" height="72" alt="Morphos" />

# Morphos

**Headless primitive component library for PraxisJS.**

Accessible by default · Zero built-in styles · Decorator-first class components

[![version](https://img.shields.io/npm/v/@morphos/core?label=%40morphos%2Fcore&color=38bdf8)](https://www.npmjs.com/package/@morphos/core)
[![coverage](https://codecov.io/gh/praxisjs-org/morphos/graph/badge.svg)](https://codecov.io/gh/praxisjs-org/morphos)
[![license](https://img.shields.io/github/license/praxisjs-org/morphos?color=38bdf8)](./LICENSE)

[Docs](https://morphos.praxisjs.org) · [Getting Started](https://morphos.praxisjs.org/docs/guide/getting-started) · [Changelog](https://morphos.praxisjs.org/docs/changelog)

</div>

---

Morphos is a headless primitive component library for [PraxisJS](https://praxisjs.org). It provides accessible, behavior-complete UI building blocks with no built-in styles — the PraxisJS equivalent of Base UI or Radix UI. A dialog knows how to open, trap focus, and close on Escape; it does not know whether it's centered, blurred, or bordered. You bring the styles, Morphos brings the behavior.

## Quick look

```tsx
import { Component, State } from '@praxisjs/decorators'
import { StatefulComponent } from '@praxisjs/core'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@morphos/overlays'

@Component()
class ConfirmEmail extends StatefulComponent {
  @State() dialog = new Dialog()

  render() {
    return (
      <>
        <DialogTrigger dialog={this.dialog}>Change email</DialogTrigger>

        <DialogContent dialog={this.dialog} aria-labelledby="dialog-title">
          <DialogTitle id="dialog-title">Change your email</DialogTitle>
          <DialogDescription>
            We'll send a confirmation link to your new address.
          </DialogDescription>
          <DialogClose dialog={this.dialog}>Cancel</DialogClose>
        </DialogContent>
      </>
    )
  }
}
```

`this.dialog` already knows whether it's open, traps focus while it is, locks page scroll, and closes on Escape or backdrop click — no context provider, no hooks required. Every compound component in the library follows this same shape: create the root instance once, pass it down to its parts as a prop named after the component.

## Packages

### Core

| Package | Version | Description |
|---|---|---|
| [`@morphos/core`](packages/core) | `0.1.0` | Shared utilities — `generateId`, `trapFocus`, `lockScroll`, `computeAnchorPosition`, `Keys`, keyboard helpers, shared types |

```sh
npm install @praxisjs/core @praxisjs/decorators @praxisjs/runtime @praxisjs/jsx
npm install @morphos/core
```

### Components

| Package | Version | Description |
|---|---|---|
| [`@morphos/inputs`](packages/inputs) | `0.1.0` | `Button`, `Input`, `Checkbox`, `CheckboxGroup`, `RadioGroup` + `Radio`, `Select`, `Switch`, `Toggle`, `ToggleGroup`, `Slider`, `NumberField`, `OtpField`, `Combobox`, `Autocomplete`, `Field`, `Fieldset`, `Form` |
| [`@morphos/overlays`](packages/overlays) | `0.1.0` | `Dialog`, `AlertDialog`, `Drawer`, `Popover`, `Tooltip`, `Dropdown` (aliased `Menu`), `ContextMenu`, `PreviewCard` |
| [`@morphos/layout`](packages/layout) | `0.1.0` | `Accordion`, `Tabs`, `Disclosure` (aliased `Collapsible`), `Separator`, `ScrollArea`, `Toolbar`, `Menubar`, `NavigationMenu` |
| [`@morphos/feedback`](packages/feedback) | `0.1.0` | `ToastProvider` + `Toast`, `Alert`, `Progress`, `Spinner`, `Avatar`, `Meter` |
| [`@morphos/icons`](packages/icons) | `0.0.0` | `Icon` (generic SVG primitive for raw markup), `LucideIcon` (renders `lucide` icon data), `PhosphorIcon` (renders `@phosphor-icons/core` SVG assets) — neither icon library is a dependency, bring your own |

`@morphos/core` is a required peer of every package below — install it once alongside whichever categories you need.

```sh
npm install @morphos/inputs @morphos/overlays @morphos/layout @morphos/feedback @morphos/icons
```

### Styling

| Package | Version | Description |
|---|---|---|
| [`@morphos/styles`](packages/styles) | `0.1.0` | Optional, opt-in CSS recipes — one file per component, nothing applied unless you import it |

```sh
npm install @morphos/styles
```

## Monorepo layout

```
packages/
  core        shared utilities, no UI
  inputs      form primitives
  overlays    dialogs, popovers, menus
  layout      accordions, tabs, toolbars
  feedback    toasts, alerts, progress
  icons       Icon, LucideIcon, PhosphorIcon
  styles      optional CSS recipes
playground/   manual testing app (Vite)
storybook/    component stories
docs/         documentation site (Next.js + Fumadocs)
```

## Development

Requires [pnpm](https://pnpm.io).

```sh
pnpm install

# build everything (required before first run)
pnpm build
pnpm build:core          # build only @morphos/core

# watch mode — rebuild all packages on change
pnpm dev

# playground (hot-reload manual test app)
pnpm --filter playground dev

# tests — always run from the monorepo root, never with --filter
pnpm test
pnpm test:watch
pnpm test:coverage

# lint + typecheck
pnpm lint
pnpm lint:fix
pnpm typecheck

# docs dev server
pnpm docs:dev
```

> After editing a package's source, rebuild it before dependent packages pick up the change:
> `pnpm --filter @morphos/core build`

## Releases

Changesets — pick affected packages, bump type, and summary:

```sh
pnpm changeset          # interactive — create a changeset
pnpm version-packages   # bump versions
pnpm release            # publish to npm
```

## Contributing

Morphos is built on top of PraxisJS, a personal project explored out of curiosity. Contributions are welcome — bug reports, ideas, and pull requests. Opening an issue before a large change is appreciated.

## License

[MIT](./LICENSE)
