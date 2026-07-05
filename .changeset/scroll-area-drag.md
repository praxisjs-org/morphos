---
"@morphos/layout": minor
---

`ScrollArea`'s scrollbar overlay is now interactive: `ScrollAreaThumb` can be dragged, and clicking `ScrollAreaScrollbar`'s track jumps the scroll position to that spot, matching native scrollbar behavior. Adds a new `ScrollArea.scrollTo({ top?, left? })` method.
