---
"@morphos/core": patch
"@morphos/feedback": patch
"@morphos/icons": patch
"@morphos/inputs": patch
"@morphos/layout": patch
"@morphos/overlays": patch
---

Opt into `@praxisjs/vite-plugin`'s library optimization (`"praxisjs": { "optimize": true }`): with vite-plugin 4.2 or later, apps compile Morphos components from their sources like their own code (compiled templates, keyed lists, decorated fields in fast properties), which makes stateful components mount about 25 to 40% faster. Older plugin versions ignore the field. Published packages no longer include their tests.
