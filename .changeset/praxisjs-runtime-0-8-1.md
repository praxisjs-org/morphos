---
"@morphos/core": patch
"@morphos/feedback": patch
"@morphos/icons": patch
"@morphos/inputs": patch
"@morphos/layout": patch
"@morphos/overlays": patch
---

Require `@praxisjs/runtime` and `@praxisjs/jsx` 0.8.1, which write boolean `aria-*` attributes as `"true"` and `"false"` instead of an empty attribute (or none for `false`), so every Morphos component gets correct ARIA states.
