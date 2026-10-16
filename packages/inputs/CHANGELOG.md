# @morphos/inputs

## 1.1.0

### Minor Changes

- a923ca7: Render lists with `For` and move "one of many" comparisons to `@Selector`, so updates touch only the rows that changed.

  Morphos is built with `tsc`, so the PraxisJS Vite plugin's rewrite of keyed `.map()` lists never reached the published code: every list was rebuilt on each change, and every option re-ran its bindings when the active option moved.

  - `Select`, `Combobox` and `Autocomplete` render options with `For` keyed by `value`. Filtering keeps the rows that still match, and changing `Select`'s `options` updates the listbox and the hidden native `<select>` in place (the hidden `<select>` used to keep its first options).
  - Active and selected state goes through `@Selector`: one arrow key now runs 3 effects instead of one per option in `Select` and `Combobox` (6 instead of two per option in `Autocomplete`), whatever the number of options.
  - `ToastProvider` renders toasts with `For` keyed by `id`.
  - `RadioGroup`, `Tabs`, `Menubar`, `NavigationMenu` and `Toolbar` use `@Selector` so a selection change updates only the previous and next part.

  Ids, `aria-*`/`data-*` attributes, keyboard navigation, focus and public APIs are unchanged.

  The `@praxisjs/*` peer dependencies of these packages are raised to `@praxisjs/core` >=2.3.0, `@praxisjs/decorators` >=2.0.0, `@praxisjs/runtime` >=0.8.0 and `@praxisjs/jsx` >=0.8.0, the releases that provide `For`, `Index` and `@Selector`, which the code now imports. `@praxisjs/jsx` is included because it mounts `For` and pins the matching `@praxisjs/runtime`.

### Patch Changes

- a923ca7: Opt into `@praxisjs/vite-plugin`'s library optimization (`"praxisjs": { "optimize": true }`): with vite-plugin 4.2 or later, apps compile Morphos components from their sources like their own code (compiled templates, keyed lists, decorated fields in fast properties), which makes stateful components mount about 25 to 40% faster. Older plugin versions ignore the field. Published packages no longer include their tests.
- Updated dependencies [a923ca7]
  - @morphos/core@0.1.5

## 1.0.4

### Patch Changes

- 75dea1d: Update the `@praxisjs/*` dependencies to the latest releases: `@praxisjs/core` 2.3, `@praxisjs/decorators` 2.0, `@praxisjs/runtime` 0.8, `@praxisjs/jsx` 0.8 and `@praxisjs/shared` 0.3.2. Components get the new reactive graph, compiled templates, keyed lists and fast decorated fields; no Morphos API changes.
- Updated dependencies [75dea1d]
  - @morphos/core@0.1.4

## 1.0.3

### Patch Changes

- 6ce2e48: Bump `@praxisjs/*` dev dependencies used for local development and testing (`core` to `^2.2.0`, `decorators` to `^1.7.0`, `jsx` to `^0.7.6`, `runtime` to `^0.7.0`, `vite-plugin` to `^4.0.6`). Peer dependency ranges are unchanged, so this doesn't affect what consumers can install.
- c27e88e: Bump `@praxisjs/*` dev dependencies used for local development and testing (`jsx` to `^0.7.7`, `runtime` to `^0.7.1`). This picks up the runtime fix for event props passed as `undefined`. Peer dependency ranges are unchanged, so this doesn't affect what consumers can install.
- Updated dependencies [6ce2e48]
- Updated dependencies [c27e88e]
  - @morphos/core@0.1.3

## 1.0.2

### Patch Changes

- 53fe5ae: Bump `@praxisjs/*` dev dependencies used for local development and testing (`core` to `^2.1.0`, `decorators` to `^1.6.1`, `jsx` to `^0.7.5`, `runtime` to `^0.6.0`, `vite-plugin` to `^4.0.5`). Peer dependency ranges are unchanged, so this doesn't affect what consumers can install.
- Updated dependencies [53fe5ae]
  - @morphos/core@0.1.2

## 1.0.1

### Patch Changes

- 3defa68: Bump TypeScript to 6.0.3 and Vite to 8.1.4 via a shared pnpm catalog entry. Internal build tooling change only, no public API impact.
- Updated dependencies [3defa68]
  - @morphos/core@0.1.1

## 1.0.0

### Minor Changes

- a1ba933: Initial release. `Button`, `Input`, `Checkbox`, `CheckboxGroup`, `Select`, `RadioGroup` + `Radio`, `Switch`, `Toggle`, `ToggleGroup`, `Slider`, `NumberField`, `OtpField`, `Combobox`, `Autocomplete`, `Field`, `Fieldset`, and `Form`.

### Patch Changes

- Updated dependencies [a1ba933]
  - @morphos/core@0.1.0
