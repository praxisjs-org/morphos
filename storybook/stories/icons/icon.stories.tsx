import { StatefulComponent } from "@praxisjs/core";
import { Component, Prop } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Icon, IconProvider, LucideSource } from "@morphos/icons";

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

type Args = {
  name: string;
  size: number;
  color: string;
};

const meta: Meta<Args> = {
  title: "Icons/Icon",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Renders an SVG icon by name, resolved against whichever provider `IconProvider` " +
          "configured for the app. There is no default provider — every demo below applies " +
          "`@IconProvider(LucideSource)` up front, exactly as a real app must.",
      },
    },
  },
  argTypes: {
    name: { control: "text" },
    size: { control: { type: "range", min: 12, max: 64, step: 4 } },
    color: { control: "color" },
  },
  args: {
    name: "Plus",
    size: 32,
    color: "#0ea5e9",
  },
};
export default meta;

type Story = StoryObj<Args>;

// ---------------------------------------------------------------------------
// Default — args-driven
// ---------------------------------------------------------------------------

@IconProvider(LucideSource)
@Component()
class DefaultDemo extends StatefulComponent {
  @Prop() name!: string;
  @Prop() size!: number;
  @Prop() color!: string;

  render() {
    return (
      <div style="font-family:sans-serif;display:flex;align-items:center;gap:16px;padding:24px">
        <Icon name={this.name} size={this.size} color={this.color} aria-label={this.name} />
        <span style="font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
          name={this.name}
        </span>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: (args) => <DefaultDemo name={args.name} size={args.size} color={args.color} />,
};

// ---------------------------------------------------------------------------
// Gallery — a handful of lucide icons
// ---------------------------------------------------------------------------

const GALLERY_NAMES = ["Plus", "Heart", "Settings", "Trash2", "ArrowRight"];

@IconProvider(LucideSource)
@Component()
class GalleryDemo extends StatefulComponent {
  render() {
    return (
      <div style="font-family:sans-serif;padding:24px;display:flex;gap:24px">
        {GALLERY_NAMES.map((name) => (
          <div style="display:flex;flex-direction:column;align-items:center;gap:8px" key={name}>
            <Icon name={name} size={28} aria-label={name} />
            <span style="font-size:.6875rem;color:var(--morphos-color-text-muted);font-family:monospace">
              {name}
            </span>
          </div>
        ))}
      </div>
    );
  }
}

export const Gallery: StoryObj = {
  name: "Gallery",
  render: () => <GalleryDemo />,
};

// ---------------------------------------------------------------------------
// UnknownName — the runtime fallback for a name that doesn't exist
// ---------------------------------------------------------------------------

@IconProvider(LucideSource)
@Component()
class UnknownNameDemo extends StatefulComponent {
  render() {
    return (
      <div style="font-family:sans-serif;padding:24px;max-width:360px">
        <Icon name="NotARealIconName" />
        <p style="margin:12px 0 0;font-size:.75rem;font-family:monospace;color:var(--morphos-color-text-muted)">
          Renders nothing (check the console for a warning) instead of throwing — this cell is
          intentionally empty above.
        </p>
      </div>
    );
  }
}

export const UnknownName: StoryObj = {
  name: "Unknown name",
  render: () => <UnknownNameDemo />,
};
