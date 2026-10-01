---
"@morphos/icons": minor
---

`iconsPlugin()` now trims the built-in `"lucide"` set in production builds, bundling only the icons referenced in your source instead of all ~2,100 (~500 kB). New `lucide` option: `{ include, scan }` to add runtime-built names or scan more directories, or `false` to opt out.
