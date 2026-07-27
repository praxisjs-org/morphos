import { lucideIcons } from "./lucide";
import { IconSource } from "../provider/icon-source";
import { RegisterIconProvider } from "../provider/register-icon-provider";

import type { IconData } from "../provider/registry";

/**
 * The built-in `"lucide"` provider — implemented as a regular `IconSource`,
 * registered the same way any custom provider would be. There's no special
 * casing for lucide anywhere else in the package; `Icon` resolves it through
 * the same `IconSource`/registry pipeline as everything else.
 */
@RegisterIconProvider("lucide")
export class LucideSource extends IconSource {
  resolve(name: string): IconData | undefined {
    const nodes = Object.hasOwn(lucideIcons, name) ? lucideIcons[name as keyof typeof lucideIcons] : undefined;
    return nodes ? { nodes, viewBox: "0 0 24 24" } : undefined;
  }
}
