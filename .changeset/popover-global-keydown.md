---
"@morphos/overlays": patch
---

Fix `Popover` not closing on `Escape` when focus is outside the popover content by listening for `keydown` on `document` instead of the content element.
