import { StatefulComponent } from "@praxisjs/core";
import { Component, Compose, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Icon, IconInstance, IconProvider, IconSource, LucideSource, RegisterIconProvider } from "@morphos/icons";
import type { IconProviderName } from "@morphos/icons";

const meta: Meta = {
  title: "Icons/IconInstance",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Wraps `getIconProvider`/`setIconProvider` as a PraxisJS `Composable` — use it from " +
          "inside a component via `@Compose(IconInstance)` to build a provider-switcher control, " +
          "instead of calling the plain functions directly.",
      },
    },
  },
};
export default meta;

// Same "brand" provider as the IconProvider story — see icon-provider.mdx for the walkthrough.
@RegisterIconProvider("brand", "./brand-icons/*.svg")
class BrandIcons extends IconSource {}

const NAMES_BY_PROVIDER: Record<string, readonly string[]> = {
  lucide: ["Plus", "Heart", "ArrowRight"],
  brand: ["bolt", "diamond"],
};

@IconProvider([LucideSource, BrandIcons])
@Component()
class ProviderSwitcherDemo extends StatefulComponent {
  @Compose(IconInstance) iconInstance!: IconInstance;
  @State() private _current: IconProviderName = "lucide";

  onBeforeMount() {
    this._current = this.iconInstance.provider ?? "lucide";
  }

  private select(provider: IconProviderName) {
    this.iconInstance.setProvider(provider);
    this._current = provider;
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px;display:flex;flex-direction:column;gap:16px">
        <div style="display:flex;gap:8px">
          <button onClick={() => this.select("lucide")} disabled={() => this._current === "lucide"}>
            Lucide
          </button>
          <button onClick={() => this.select("brand")} disabled={() => this._current === "brand"}>
            Brand
          </button>
        </div>

        {() => (
          <div style="display:flex;gap:16px">
            {(NAMES_BY_PROVIDER[this._current] ?? []).map((name) => (
              <Icon name={name} provider={this._current} size={28} aria-label={name} />
            ))}
          </div>
        )}

        <p style="margin:0;font-size:.75rem;font-family:monospace;color:var(--morphos-color-text-muted);max-width:420px">
          {'@Compose(IconInstance) → this.iconInstance.setProvider("...")'}
        </p>
      </div>
    );
  }
}

export const Default: StoryObj = {
  name: "Default",
  render: () => <ProviderSwitcherDemo />,
};
