# @morphos/styles

## 0.2.0

### Minor Changes

- 635e24f: Add a `--danger` variant to the `Button`, `DropdownItem`, and `ContextMenuItem` recipes (`morphos-button--danger`, combinable with `--outline`; `morphos-dropdown-item--danger`; `morphos-context-menu-item--danger`) for destructive actions.

  Also fixes `morphos-alert-dialog-action`, which previously defaulted to the danger color for every confirmation — it now uses the accent color by default, with a new `morphos-alert-dialog-action--danger` modifier for destructive confirmations.

  Add a `morphos-dropdown-trigger` recipe class for `DropdownTrigger` (pair with `morphos-button`) that lays out the label and a chevron indicator (label left, chevron right) and rotates the chevron based on `[data-open]`.

## 0.1.0

### Minor Changes

- a1ba933: Initial release. Optional, opt-in CSS recipes — one file per component plus shared design tokens — for every component across `@morphos/inputs`, `@morphos/overlays`, `@morphos/layout`, and `@morphos/feedback`.
