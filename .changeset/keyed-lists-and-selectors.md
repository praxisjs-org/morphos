---
"@morphos/inputs": minor
"@morphos/layout": minor
"@morphos/feedback": minor
---

Render lists with `For` and move "one of many" comparisons to `@Selector`, so updates touch only the rows that changed.

Morphos is built with `tsc`, so the PraxisJS Vite plugin's rewrite of keyed `.map()` lists never reached the published code: every list was rebuilt on each change, and every option re-ran its bindings when the active option moved.

- `Select`, `Combobox` and `Autocomplete` render options with `For` keyed by `value`. Filtering keeps the rows that still match, and changing `Select`'s `options` updates the listbox and the hidden native `<select>` in place (the hidden `<select>` used to keep its first options).
- Active and selected state goes through `@Selector`: one arrow key now runs 3 effects instead of one per option in `Select` and `Combobox` (6 instead of two per option in `Autocomplete`), whatever the number of options.
- `ToastProvider` renders toasts with `For` keyed by `id`.
- `RadioGroup`, `Tabs`, `Menubar`, `NavigationMenu` and `Toolbar` use `@Selector` so a selection change updates only the previous and next part.

Ids, `aria-*`/`data-*` attributes, keyboard navigation, focus and public APIs are unchanged.

The `@praxisjs/*` peer dependencies of these packages are raised to `@praxisjs/core` >=2.3.0, `@praxisjs/decorators` >=2.0.0, `@praxisjs/runtime` >=0.8.0 and `@praxisjs/jsx` >=0.8.0, the releases that provide `For`, `Index` and `@Selector`, which the code now imports. `@praxisjs/jsx` is included because it mounts `For` and pins the matching `@praxisjs/runtime`.
