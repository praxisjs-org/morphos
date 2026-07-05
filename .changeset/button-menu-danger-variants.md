---
"@morphos/styles": minor
---

Add a `--danger` variant to the `Button`, `DropdownItem`, and `ContextMenuItem` recipes (`morphos-button--danger`, combinable with `--outline`; `morphos-dropdown-item--danger`; `morphos-context-menu-item--danger`) for destructive actions.

Also fixes `morphos-alert-dialog-action`, which previously defaulted to the danger color for every confirmation — it now uses the accent color by default, with a new `morphos-alert-dialog-action--danger` modifier for destructive confirmations.

Add a `morphos-dropdown-trigger` recipe class for `DropdownTrigger` (pair with `morphos-button`) that lays out the label and a chevron indicator (label left, chevron right) and rotates the chevron based on `[data-open]`.
