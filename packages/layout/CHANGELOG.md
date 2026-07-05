# @morphos/layout

## 1.1.0

### Minor Changes

- 8a614d9: `ScrollArea`'s scrollbar overlay is now interactive: `ScrollAreaThumb` can be dragged, and clicking `ScrollAreaScrollbar`'s track jumps the scroll position to that spot, matching native scrollbar behavior. Adds a new `ScrollArea.scrollTo({ top?, left? })` method.

## 1.0.0

### Minor Changes

- a1ba933: Initial release. `Accordion`, `Tabs`, `Disclosure` (aliased `Collapsible`), `Separator`, `ScrollArea`, `Toolbar`, `Menubar`, and `NavigationMenu`.

### Patch Changes

- Updated dependencies [a1ba933]
  - @morphos/core@0.1.0
