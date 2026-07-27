import { Composable } from "@praxisjs/core";

import { getIconProvider, setIconProvider, type IconProviderName } from "./provider-store";

/**
 * PraxisJS composable form of `getIconProvider`/`setIconProvider` — use it from
 * inside a component with `@Compose(IconInstance)`, same as `WindowSize`:
 *
 * ```tsx
 * @Component()
 * class IconProviderSwitcher extends StatefulComponent {
 *   @Compose(IconInstance) iconInstance!: IconInstance;
 *
 *   render() {
 *     return <button onClick={() => this.iconInstance.setProvider("brand")}>Use brand icons</button>;
 *   }
 * }
 * ```
 *
 * `provider` is a snapshot taken when the composable is set up (component construction),
 * same as `Icon` itself — it doesn't live-update if something else changes the provider later.
 * It's `undefined` until `IconProvider`/`setIconProvider` has run — there's no default.
 */
export class IconInstance extends Composable {
  declare provider: IconProviderName | undefined;
  declare setProvider: (provider: IconProviderName) => void;

  setup() {
    return {
      provider: getIconProvider(),
      setProvider: (provider: IconProviderName) => {
        setIconProvider(provider);
      },
    };
  }
}
