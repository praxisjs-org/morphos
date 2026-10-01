---
"@morphos/icons": major
---

**Breaking:** `LucideSource` and the `LucideIconName` type moved from `@morphos/icons` to the new `@morphos/icons/lucide` subpath. The main entry no longer imports `lucide`, which is now an optional peer dependency — apps that use only their own icon set no longer need it installed or bundled. `Icon`'s `name` autocompletes lucide's names once `@morphos/icons/lucide` is imported. Update imports to `import { LucideSource } from "@morphos/icons/lucide"`.
