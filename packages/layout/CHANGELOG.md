# @morphos/layout

## 1.1.2

### Patch Changes

- 53fe5ae: Bump `@praxisjs/*` dev dependencies used for local development and testing (`core` to `^2.1.0`, `decorators` to `^1.6.1`, `jsx` to `^0.7.5`, `runtime` to `^0.6.0`, `vite-plugin` to `^4.0.5`). Peer dependency ranges are unchanged, so this doesn't affect what consumers can install.
- Updated dependencies [53fe5ae]
  - @morphos/core@0.1.2

## 1.1.1

### Patch Changes

- 3defa68: Bump TypeScript to 6.0.3 and Vite to 8.1.4 via a shared pnpm catalog entry. Internal build tooling change only, no public API impact.
- Updated dependencies [3defa68]
  - @morphos/core@0.1.1

## 1.1.0

### Minor Changes

- 8a614d9: `ScrollArea`'s scrollbar overlay is now interactive: `ScrollAreaThumb` can be dragged, and clicking `ScrollAreaScrollbar`'s track jumps the scroll position to that spot, matching native scrollbar behavior. Adds a new `ScrollArea.scrollTo({ top?, left? })` method.

## 1.0.0

### Minor Changes

- a1ba933: Initial release. `Accordion`, `Tabs`, `Disclosure` (aliased `Collapsible`), `Separator`, `ScrollArea`, `Toolbar`, `Menubar`, and `NavigationMenu`.

### Patch Changes

- Updated dependencies [a1ba933]
  - @morphos/core@0.1.0
