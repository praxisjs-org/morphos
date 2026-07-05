import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Switch } from "@morphos/inputs";

const meta: Meta<{ defaultChecked: boolean; disabled: boolean }> = {
  title: "Inputs/Switch",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Toggle switch rendered as a `<button role='switch'>`. Exposes `data-checked` and `data-disabled` for CSS-driven track and thumb animation. Styled here with the `@morphos/styles` `morphos-switch` recipe, which paints the thumb via `::before` — no extra child element needed.",
      },
    },
  },
  argTypes: {
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    defaultChecked: false,
    disabled: false,
  },
};
export default meta;

type Story = StoryObj<{ defaultChecked: boolean; disabled: boolean }>;

export const Default: Story = {
  name: "Default",
  render: (args) => (
    <div style="font-family:sans-serif;padding:24px">
      <div style="display:flex;align-items:center;gap:12px">
        <Switch
          class="morphos-switch"
          defaultChecked={args.defaultChecked}
          disabled={args.disabled}
          aria-label="Toggle feature"
        />
        <span style="font-size:.875rem;color:var(--morphos-color-text)">Enable feature</span>
      </div>
      <p style="margin:12px 0 0;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
        data-checked={args.defaultChecked ? '""' : "undefined"} (initial) |
        data-disabled={args.disabled ? '""' : "undefined"}
      </p>
    </div>
  ),
};

export const Checked: Story = {
  name: "Checked",
  render: () => (
    <div style="font-family:sans-serif;padding:24px">
      <div style="display:flex;align-items:center;gap:12px">
        <Switch class="morphos-switch" defaultChecked={true} aria-label="Checked switch" />
        <span style="font-size:.875rem;color:var(--morphos-color-text)">Notifications enabled</span>
      </div>
      <p style="margin:12px 0 0;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
        defaultChecked=true — starts in on state
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => (
    <div style="font-family:sans-serif;padding:24px">
      <div style="display:flex;flex-direction:column;gap:14px">
        <div style="display:flex;align-items:center;gap:12px">
          <Switch class="morphos-switch" disabled defaultChecked={false} aria-label="Disabled off switch" />
          <span style="font-size:.875rem;color:var(--morphos-color-text-muted)">Disabled (off)</span>
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <Switch class="morphos-switch" disabled defaultChecked={true} aria-label="Disabled on switch" />
          <span style="font-size:.875rem;color:var(--morphos-color-text-muted)">Disabled (on)</span>
        </div>
      </div>
      <p style="margin:12px 0 0;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
        data-disabled="" on both
      </p>
    </div>
  ),
};

@Component()
class ControlledSwitchDemo extends StatefulComponent {
  @State() checked = false;

  onBeforeMount() {
    this.checked = false;
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <Switch
            class="morphos-switch"
            checked={() => this.checked}
            onCheckedChange={(val: boolean) => { this.checked = val; }}
            aria-label="Controlled switch"
          />
          <span style="font-size:.875rem;color:var(--morphos-color-text)">
            {() => this.checked ? "Dark mode on" : "Dark mode off"}
          </span>
        </div>
        <div style="display:flex;gap:8px">
          <button
            class="morphos-button morphos-button--outline"
            onClick={() => { this.checked = true; }}
          >
            Force on
          </button>
          <button
            class="morphos-button morphos-button--outline"
            onClick={() => { this.checked = false; }}
          >
            Force off
          </button>
        </div>
        <p style="margin:12px 0 0;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
          checked: {() => String(this.checked)}
        </p>
      </div>
    );
  }
}

export const Controlled: Story = {
  name: "Controlled",
  render: () => <ControlledSwitchDemo />,
};
