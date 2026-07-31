---
"@morphos/icons": patch
---

Cover all structured icon shape tags (`circle`, `rect`, `line`, `polyline`, `ellipse`) and the unregistered-resolver error path in `IconProvider`. Removed a dead `ref` null-check in `Icon` — the runtime never invokes DOM `ref` callbacks with `null`.
