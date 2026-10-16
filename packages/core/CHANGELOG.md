# @morphos/core

## 0.1.4

### Patch Changes

- 75dea1d: Update the `@praxisjs/*` dependencies to the latest releases: `@praxisjs/core` 2.3, `@praxisjs/decorators` 2.0, `@praxisjs/runtime` 0.8, `@praxisjs/jsx` 0.8 and `@praxisjs/shared` 0.3.2. Components get the new reactive graph, compiled templates, keyed lists and fast decorated fields; no Morphos API changes.

## 0.1.3

### Patch Changes

- 6ce2e48: Bump `@praxisjs/*` dev dependencies used for local development and testing (`core` to `^2.2.0`, `decorators` to `^1.7.0`, `jsx` to `^0.7.6`, `runtime` to `^0.7.0`, `vite-plugin` to `^4.0.6`). Peer dependency ranges are unchanged, so this doesn't affect what consumers can install.
- c27e88e: Bump `@praxisjs/*` dev dependencies used for local development and testing (`jsx` to `^0.7.7`, `runtime` to `^0.7.1`). This picks up the runtime fix for event props passed as `undefined`. Peer dependency ranges are unchanged, so this doesn't affect what consumers can install.

## 0.1.2

### Patch Changes

- 53fe5ae: Bump `@praxisjs/*` dev dependencies used for local development and testing (`core` to `^2.1.0`, `decorators` to `^1.6.1`, `jsx` to `^0.7.5`, `runtime` to `^0.6.0`, `vite-plugin` to `^4.0.5`). Peer dependency ranges are unchanged, so this doesn't affect what consumers can install.

## 0.1.1

### Patch Changes

- 3defa68: Bump TypeScript to 6.0.3 and Vite to 8.1.4 via a shared pnpm catalog entry. Internal build tooling change only, no public API impact.

## 0.1.0

### Minor Changes

- a1ba933: Initial release. Shared utilities used by every other Morphos package: `generateId`, `trapFocus`, `lockScroll`, `getFocusableElements`, `computeAnchorPosition`, `Keys` and keyboard helpers, `wrapIndex`, and shared types.
