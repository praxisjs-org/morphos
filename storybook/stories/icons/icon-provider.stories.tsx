import { StatefulComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Icon, IconProvider, IconSource, RegisterIconProvider } from "@morphos/icons";

const meta: Meta = {
  title: "Icons/IconProvider",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Configures the icon provider for the whole app — mandatory, with no exceptions and no " +
          "default (`lucide` included). Applied directly to the root component, same as `@Router` " +
          "— it runs at class-decoration time, before the class is ever instantiated, so it's " +
          "already active before any `Icon` beneath it mounts. Takes an `IconSource` class " +
          "directly (not a string), and an array registers more than one at once.",
      },
    },
  },
};
export default meta;

// ---------------------------------------------------------------------------
// Two small custom providers — see icon-provider.mdx for the full walkthrough.
// The @morphos/icons/vite plugin (wired up in .storybook/main.ts) rewrites the
// glob path below into an import.meta.glob(...) call at build time.
// ---------------------------------------------------------------------------

@RegisterIconProvider("brand", "./brand-icons/*.svg")
class BrandIcons extends IconSource {}

@RegisterIconProvider("marketing", {
  megaphone:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 10v4a1 1 0 001 1h2l4 5h2l-2-6h2l8 4V6L12 10H10L8 4H6l2 6H6a1 1 0 00-3 0z"/></svg>',
})
class MarketingIcons extends IconSource {}

@IconProvider([BrandIcons, MarketingIcons])
@Component()
class App extends StatefulComponent {
  render() {
    return (
      <div style="font-family:sans-serif;padding:24px;display:flex;flex-direction:column;gap:20px">
        <div>
          <span style="font-size:.6875rem;color:var(--morphos-color-text-muted);text-transform:uppercase;letter-spacing:0.05em;font-weight:600">
            {"@IconProvider([BrandIcons, MarketingIcons]) — BrandIcons is first, so it's the default"}
          </span>
          <div style="margin-top:8px;display:flex;gap:16px">
            <Icon name="bolt" size={28} aria-label="bolt" />
            <Icon name="diamond" size={28} aria-label="diamond" />
          </div>
        </div>

        <div>
          <span style="font-size:.6875rem;color:var(--morphos-color-text-muted);text-transform:uppercase;letter-spacing:0.05em;font-weight:600">
            {'<Icon provider="marketing"> — the second entry is still available, just not default'}
          </span>
          <div style="margin-top:8px;display:flex;gap:16px">
            <Icon name="megaphone" provider="marketing" size={28} aria-label="megaphone" />
          </div>
        </div>

        <p style="margin:0;font-size:.75rem;font-family:monospace;color:var(--morphos-color-text-muted);max-width:420px">
          {"@IconProvider registers every class in the array and reads each one's name straight off "}
          {"it — no string to keep in sync. The first entry becomes the app-wide default; the rest "}
          {"only resolve when an Icon's own provider prop asks for them by name."}
        </p>
      </div>
    );
  }
}

export const Default: StoryObj = {
  name: "Default",
  render: () => <App />,
};
