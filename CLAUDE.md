# Morphos — Agent Guide

Headless primitive component library for PraxisJS. Monorepo managed with pnpm workspaces and changesets.

---

## Package map

| Package | Role |
|---|---|
| `@morphos/core` | Shared utilities — `generateId`, `trapFocus`, `lockScroll`, `computeAnchorPosition`, `Keys`, keyboard helpers, shared types |
| `@morphos/inputs` | `Button`, `Input`, `Checkbox`, `CheckboxGroup`, `Select`, `RadioGroup` + `Radio`, `Switch`, `Toggle`, `ToggleGroup`, `Slider`, `NumberField`, `OtpField`, `Combobox`, `Autocomplete`, `Field`, `Fieldset`, `Form` |
| `@morphos/overlays` | `Dialog`, `Tooltip`, `Popover`, `Dropdown` (aliased as `Menu`), `AlertDialog`, `Drawer`, `ContextMenu`, `PreviewCard` and their compound parts |
| `@morphos/layout` | `Accordion`, `Tabs`, `Disclosure` (aliased as `Collapsible`), `Separator`, `ScrollArea`, `Toolbar`, `Menubar`, `NavigationMenu` and their compound parts |
| `@morphos/feedback` | `ToastProvider`, `Toast`, `Alert`, `Progress`, `Spinner`, `Avatar`, `Meter` |
| `@morphos/icons` | `Icon` (generic SVG primitive for raw markup), `LucideIcon` (renders `lucide` package icon data), `PhosphorIcon` (renders raw SVG assets from `@phosphor-icons/core`). Neither `lucide` nor `@phosphor-icons/core` is a dependency — consumers install whichever icon set they use |
| `@morphos/styles` | Optional, opt-in CSS recipes — one plain CSS file per component plus `tokens.css`. Nothing is applied unless explicitly imported. Not a peer of the other packages; pure CSS, not built by `tsc` |

Private:

| Package | Role |
|---|---|
| `playground` | Vite dev app for manual testing |
| `morphos-stories` | Storybook stories |
| `@morphos/docs` | Fumadocs + Next.js documentation site |

---

## Workspace layout

```
packages/   core  inputs  overlays  layout  feedback  icons  styles
playground/
storybook/
docs/
```

---

## Commands

```bash
# Development
pnpm dev                         # watch-build all packages
pnpm --filter @morphos/core dev

# Build
pnpm build                       # build all packages
pnpm build:core                  # build only @morphos/core
pnpm --filter @morphos/inputs build

# Playground
pnpm --filter playground dev

# Tests — always run from monorepo root, never with --filter
pnpm test
pnpm test:watch
pnpm test:coverage

# Lint
pnpm lint
pnpm lint:fix

# Docs
pnpm docs:dev
pnpm docs:build
```

---

## Build system

All packages use `tsc`. No bundler. Each package has its own `tsconfig.json` extending
`tsconfig.base.json`. Output goes to `dist/`.

`@morphos/styles` is the exception — it ships plain `.css` files directly from `src/`, with no
build step.

After editing a package's source, rebuild it before dependent packages pick up changes:

```bash
pnpm --filter @morphos/core build
```

---

## Component architecture

All Morphos components are PraxisJS class components. Two patterns are used:

### Simple components

Extend `StatelessComponent` from `@praxisjs/core`. Used for purely presentational primitives
or those with no internal reactive state beyond what the parent provides.

```tsx
@Component()
export class Button extends StatelessComponent<ButtonProps> {
  render() {
    return <button disabled={this.props.disabled}>{this.props.children}</button>
  }
}
```

### Stateful components

Extend `StatefulComponent` from `@praxisjs/core`. Use `@State()` for internal state and
`@Prop()` for external props. Used by components that own open/close, selection, or focus state.

```tsx
@Component()
export class Dialog extends StatefulComponent {
  @Prop() open?: boolean
  @State() _open = false

  get isOpen() { return this.open ?? this._open }

  openDialog() { /* ... */ }
  closeDialog() { /* ... */ }

  render() { return <>{this.props.children}</> }
}
```

### Compound components

Components with multiple parts (Dialog, Accordion, Tabs, etc.) are split into separate classes.
Each part receives the root component instance as a `dialog`, `accordion`, or `tabs` prop.
This avoids React Context and stays idiomatic to PraxisJS.

```tsx
// Consumer usage
@Component()
class MyPage extends StatefulComponent {
  @State() dialog = new Dialog()

  render() {
    return (
      <>
        <DialogTrigger dialog={this.dialog}>Open</DialogTrigger>
        <DialogContent dialog={this.dialog}>...</DialogContent>
      </>
    )
  }
}
```

---

## The `data-*` convention

Every interactive state is exposed as a `data-*` attribute on the component root.
Values: `""` (present with no value) for boolean states, a string for enum states.

| Attribute | Components |
|---|---|
| `data-open` | Combobox, Autocomplete, Select, Disclosure/Collapsible, Dialog, AlertDialog, Drawer, Popover, Dropdown/Menu, ContextMenu, PreviewCard, Tooltip |
| `data-disabled` | Button, Input, Checkbox, CheckboxGroup(Item), Select, RadioGroup/Radio, Switch, Toggle(Group), Slider, NumberField, OtpField, Combobox, Autocomplete, Field, Fieldset, Accordion, Tabs, Toolbar, Menubar, Dropdown, ContextMenu |
| `data-checked` | Checkbox, CheckboxGroupItem, Radio, Switch |
| `data-indeterminate` | Checkbox, Progress |
| `data-selected` | Combobox / Select (active option), Tabs (`Tab` / `TabPanel`) |
| `data-active` | Combobox / Autocomplete / Select (keyboard-focused option), `NavigationMenuItem` |
| `data-expanded` | `AccordionItem`, `AccordionTrigger`, `AccordionContent` |
| `data-orientation` | CheckboxGroup, RadioGroup, Slider, ToggleGroup, NavigationMenu, ScrollArea, Separator, Tabs, Toolbar |
| `data-type` | ToggleGroup (`single`/`multiple`), Accordion (`single`/`multiple`), ScrollArea (`auto`/`always`/`scroll`/`hover`/`hidden`) |
| `data-variant` | Alert, Toast |
| `data-value` | Meter, Progress, Slider |
| `data-side` | Drawer (`top`/`right`/`bottom`/`left`) |
| `data-status` | Avatar (image load status) |
| `data-scrollable` | ScrollArea |
| `data-focused` | Input |
| `data-invalid` | Field, Input |
| `data-required` | Field |
| `data-placeholder` | Select |
| `data-pressed` | Toggle, ToggleGroupItem |
| `data-index` | Combobox (option index), OtpField (cell index) |
| `data-high` / `data-low` / `data-optimum` | Meter |

This allows pure CSS styling without class manipulation:

```css
[data-disabled] { opacity: 0.5; cursor: not-allowed; }
[role="tab"][data-selected] { border-bottom: 2px solid currentColor; }
[role="dialog"][data-open] { display: block; }
```

---

## Reactivity rules

Same as PraxisJS: `render()` runs once. Arrow functions create reactive bindings:

```tsx
// reactive — updates when _open changes
{() => this._open && <div>Open</div>}

// static — snapshot at render time
{this._open && <div>Snapshot</div>}
```

Arrow functions are required for any DOM binding that must update after mount.

---

## Peer dependencies

All packages declare `@praxisjs/*` and `@morphos/core` as `peerDependencies`.
The consumer provides their own PraxisJS installation.

Dev dependencies mirror the peer dependencies for local development.

---

## Testing

Tests live in `packages/**/src/__tests__/**/*.test.ts`. Vitest resolves `@morphos/*`
imports to source files via path aliases in `vitest.config.ts` — no build needed for tests.

Default environment: `node`. DOM tests opt in per-file:

```ts
// @vitest-environment jsdom
```

**Tests are required for every package.** All state logic must be tested via the class API
(constructor, `onBeforeMount`, public methods). DOM rendering is not required in unit tests.

---

## Change checklist

Every code change is only complete when **all** of the following are done:

- [ ] **Implementation** — source files in `packages/**/src/`
- [ ] **Tests** — `packages/**/src/__tests__/` covers the change; `pnpm test` passes
- [ ] **Docs page** — `docs/content/docs/**/*.mdx` updated for user-facing changes
- [ ] **Changelog page** — `docs/content/docs/changelog/<package>.mdx` has a new entry
- [ ] **Story** — `storybook/stories/<category>/` has a new or updated `.stories.tsx` file
- [ ] **Changeset** — `.changeset/<slug>.md` created with the correct bump type

---

## Linting

- Filenames: kebab-case (enforced by `unicorn/filename-case`)
- Import order: builtins → externals → `@praxisjs/*` → `@morphos/*` → relative → types
- No `any`, no non-null assertions (`!`), no floating promises
- All imports: `import type` required for type-only imports

Pre-commit hook runs `eslint --fix` on staged `packages/**/*.{ts,tsx}`.

---

## Documentation

Docs source: `docs/content/docs/`. Built with Fumadocs + Next.js. Structure:

```
guide/       introduction  getting-started  styling
inputs/      button  input  checkbox  checkbox-group  radio  select  switch
             toggle  toggle-group  slider  number-field  otp-field  field
             fieldset  form  combobox  autocomplete
overlays/    dialog  alert-dialog  drawer  context-menu  popover  tooltip
             preview-card  dropdown
layout/      accordion  tabs  disclosure  separator  scroll-area  toolbar
             menubar  navigation-menu
feedback/    toast  alert  progress  spinner  avatar  meter
icons/       icon  lucide-icon  phosphor-icon
changelog/   core  inputs  overlays  layout  feedback  icons  styles
```

Every page needs `description:` frontmatter. Run `pnpm docs:dev` to preview.

Component page installation snippets use the `<PackageInstall pkg="@morphos/<package>" />`
MDX component (already globally registered in `docs/components/mdx.tsx`), not raw
`npm install` code blocks.

---

## Changesets

```bash
pnpm changeset        # create a changeset
pnpm version-packages # bump versions
pnpm release          # publish to npm
```

Bump types:
- **patch** — bugfixes, internal refactors
- **minor** — new exports, new props, backwards-compatible additions
- **major** — breaking API changes

---

## Language

All code comments, documentation, changelog entries, stories, and any written artifact
in this project must be in **English**. Portuguese is used only in conversation with the author.
