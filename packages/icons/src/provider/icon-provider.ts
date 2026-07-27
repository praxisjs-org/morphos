import type { RootComponent } from "@praxisjs/core/internal";
import { ClassBehavior, createClassDecorator, type ClassEnhancement } from "@praxisjs/decorators";

import { setIconProvider } from "./provider-store";
import { getIconResolver } from "./registry";

import type { IconSource } from "./icon-source";
import type { RegisteredIconSource } from "./register-icon-provider";

type IconSourceCtor = new (defaultIcons?: Record<string, string>) => IconSource;

function readProviderName(ctor: IconSourceCtor): string {
  if (typeof ctor === "function" && "__iconProviderName" in ctor) {
    return (ctor as unknown as RegisteredIconSource).__iconProviderName;
  }
  throw new Error(
    `[@morphos/icons] IconProvider received "${ctor.name}", which isn't decorated with @RegisterIconProvider.`,
  );
}

class IconProviderBehavior extends ClassBehavior {
  private readonly defaultName: string;

  constructor(source: IconSourceCtor | IconSourceCtor[]) {
    super();
    const sources = Array.isArray(source) ? source : [source];
    if (sources.length === 0) {
      throw new Error("[@morphos/icons] IconProvider requires at least one IconSource.");
    }
    const names = sources.map(readProviderName);
    for (const name of names) {
      if (getIconResolver(name) === undefined) {
        throw new Error(
          `[@morphos/icons] IconProvider received a provider named "${name}", but it isn't registered — ` +
            `make sure @RegisterIconProvider runs (i.e. the class is declared/imported) before @IconProvider.`,
        );
      }
    }
    this.defaultName = names[0];
  }

  create(_instance: RootComponent): ClassEnhancement {
    setIconProvider(this.defaultName);
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialize(_Enhanced: new (...args: any[]) => unknown, _original: new (...args: any[]) => unknown): void {
    setIconProvider(this.defaultName);
  }
}

/**
 * Sets the icon provider for the whole app. Mandatory — every app applies this
 * somewhere, with no exceptions and no implicit default; `<Icon>` warns and renders
 * nothing until it does, `"lucide"` included (`LucideSource` is just a pre-configured
 * `IconSource`, not a special case). Apply directly to the root component, same as
 * `@Router`:
 *
 * ```tsx
 * @IconProvider(BrandIcons)
 * @Component()
 * class App extends StatefulComponent {
 *   render() {
 *     return <YourApp />;
 *   }
 * }
 * ```
 *
 * `BrandIcons` must be decorated with `@RegisterIconProvider` (the built-in
 * `LucideSource` included) — `IconProvider` reads the provider name straight
 * off the class, so there's no string to keep in sync by hand.
 *
 * Pass an array to register more than one provider at once — every entry
 * becomes available for an individual `Icon`'s `provider` prop, and the
 * *first* one becomes the app-wide default:
 *
 * ```tsx
 * @IconProvider([BrandIcons, MarketingIcons])
 * @Component()
 * class App extends StatefulComponent { ... }
 * ```
 *
 * Runs at class-decoration time — before `App` is ever constructed — so the
 * provider is already active before any `<Icon>` beneath it mounts.
 */
export function IconProvider(source: IconSourceCtor | IconSourceCtor[]) {
  const decorator = createClassDecorator(new IconProviderBehavior(source));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return decorator as unknown as (value: new (...args: any[]) => any, context: ClassDecoratorContext) => void;
}
