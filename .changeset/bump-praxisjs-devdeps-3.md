---
"@morphos/core": patch
"@morphos/inputs": patch
"@morphos/overlays": patch
"@morphos/layout": patch
"@morphos/feedback": patch
"@morphos/icons": patch
---

Bump `@praxisjs/*` dev dependencies used for local development and testing (`jsx` to `^0.7.7`, `runtime` to `^0.7.1`). This picks up the runtime fix for event props passed as `undefined`. Peer dependency ranges are unchanged, so this doesn't affect what consumers can install.
