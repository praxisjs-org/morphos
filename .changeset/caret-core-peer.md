---
"@morphos/feedback": patch
"@morphos/icons": patch
"@morphos/inputs": patch
"@morphos/layout": patch
"@morphos/overlays": patch
---

Declares the `@morphos/core` peer dependency as a caret range (`^0.1.6`) instead of an exact version. With the exact pin, npm installed a second copy of `@morphos/core` or failed with a peer conflict whenever the packages were released at different patch versions, for example after `praxisjs upgrade`.
