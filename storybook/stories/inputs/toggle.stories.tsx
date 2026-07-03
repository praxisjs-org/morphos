import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Toggle } from "@morphos/inputs";

const meta: Meta<{ defaultPressed: boolean; disabled: boolean }> = {
  title: "Inputs/Toggle",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Pressable toggle button. Sets `aria-pressed` and `data-pressed` to reflect on/off state. Supports controlled (`pressed` prop) and uncontrolled (`defaultPressed`) modes. Styled here with the `@morphos/styles` `morphos-toggle` recipe.",
      },
    },
  },
  argTypes: {
    defaultPressed: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    defaultPressed: false,
    disabled: false,
  },
};
export default meta;

type Story = StoryObj<{ defaultPressed: boolean; disabled: boolean }>;

export const Default: Story = {
  name: "Default",
  render: (args) => (
    <div style="font-family:sans-serif;padding:24px">
      <Toggle
        class="morphos-toggle"
        defaultPressed={args.defaultPressed}
        disabled={args.disabled}
        aria-label="Toggle bookmark"
      >
        Bookmark
      </Toggle>
      <p style="margin:12px 0 0;font-size:.75rem;color:#6b7280;font-family:monospace">
        defaultPressed={String(args.defaultPressed)} | click to toggle
      </p>
    </div>
  ),
};

@Component()
class WithIconDemo extends StatefulComponent {
  @State() bold = false;
  @State() italic = false;
  @State() underline = false;

  onBeforeMount() {
    this.bold = false;
    this.italic = false;
    this.underline = false;
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px">
        <p style="margin:0 0 10px;font-size:.875rem;font-weight:500;color:#374151">
          Text formatting
        </p>
        <div style="display:flex;gap:4px;margin-bottom:16px">
          <Toggle
            class="morphos-toggle"
            defaultPressed={false}
            onPressedChange={(val: boolean) => { this.bold = val; }}
            aria-label="Bold"
          >
            <strong>B</strong>
          </Toggle>
          <Toggle
            class="morphos-toggle"
            defaultPressed={false}
            onPressedChange={(val: boolean) => { this.italic = val; }}
            aria-label="Italic"
          >
            <em>I</em>
          </Toggle>
          <Toggle
            class="morphos-toggle"
            defaultPressed={false}
            onPressedChange={(val: boolean) => { this.underline = val; }}
            aria-label="Underline"
          >
            <span style="text-decoration:underline">U</span>
          </Toggle>
        </div>
        <div
          style={() => {
            const styles = [
              "padding:12px 14px;border:1px solid #e5e7eb;border-radius:6px;font-size:15px;min-height:40px;color:#111827",
              this.bold ? "font-weight:700" : "",
              this.italic ? "font-style:italic" : "",
              this.underline ? "text-decoration:underline" : "",
            ].filter(Boolean).join(";");
            return styles;
          }}
        >
          The quick brown fox jumps over the lazy dog.
        </div>
        <p style="margin:10px 0 0;font-size:.75rem;color:#6b7280;font-family:monospace">
          bold:{() => String(this.bold)} italic:{() => String(this.italic)} underline:{() => String(this.underline)}
        </p>
      </div>
    );
  }
}

export const WithIcon: Story = {
  name: "With Icon",
  render: () => <WithIconDemo />,
};

export const DisabledPressed: Story = {
  name: "Disabled",
  render: () => (
    <div style="font-family:sans-serif;padding:24px">
      <div style="display:flex;gap:8px">
        <Toggle class="morphos-toggle" disabled defaultPressed={true} aria-label="Disabled pressed toggle">
          Pinned
        </Toggle>
        <Toggle class="morphos-toggle" disabled defaultPressed={false} aria-label="Disabled unpressed toggle">
          Archived
        </Toggle>
      </div>
      <p style="margin:12px 0 0;font-size:.75rem;color:#6b7280;font-family:monospace">
        data-disabled="" — both non-interactive; first is data-pressed=""
      </p>
    </div>
  ),
};
