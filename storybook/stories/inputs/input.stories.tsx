import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Input } from "@morphos/inputs";

const meta: Meta<{ placeholder: string; disabled: boolean; invalid: boolean }> = {
  title: "Inputs/Input",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Headless text input primitive. Tracks focus internally and exposes `data-focused`, `data-disabled`, and `data-invalid` attributes for CSS-driven styling. Styled here with the `@morphos/styles` `morphos-input` recipe.",
      },
    },
  },
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
  },
  args: {
    placeholder: "Enter text…",
    disabled: false,
    invalid: false,
  },
};
export default meta;

type Story = StoryObj<{ placeholder: string; disabled: boolean; invalid: boolean }>;

export const Default: Story = {
  name: "Default",
  render: (args) => (
    <div style="font-family:sans-serif;padding:24px;max-width:360px">
      <Input
        id="input-default"
        placeholder={args.placeholder}
        disabled={args.disabled}
        invalid={args.invalid}
        class="morphos-input"
        aria-label="Default input"
      />
      <p style="margin:8px 0 0;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
        data-disabled={args.disabled ? '""' : "undefined"} |
        data-invalid={args.invalid ? '""' : "undefined"}
      </p>
    </div>
  ),
};

@Component()
class WithValidationDemo extends StatefulComponent {
  @State() value = "";
  @State() touched = false;

  onBeforeMount() {
    this.value = "";
    this.touched = false;
  }

  private get _isInvalid(): boolean {
    return this.touched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value);
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px;max-width:360px">
        <label style="display:block;font-size:.875rem;font-weight:500;color:var(--morphos-color-text);margin-bottom:6px" for="email-input">
          Email address
        </label>
        <Input
          id="email-input"
          type="email"
          placeholder="you@example.com"
          value={() => this.value}
          invalid={() => this._isInvalid}
          class="morphos-input"
          onInput={(v: string) => { this.value = v; }}
          onBlur={() => { this.touched = true; }}
          aria-describedby="email-error"
        />
        {() =>
          this._isInvalid ? (
            <p id="email-error" style="margin:6px 0 0;font-size:.75rem;color:#ef4444">Please enter a valid email address.</p>
          ) : (
            <p style="margin:6px 0 0;font-size:.75rem;color:var(--morphos-color-text-muted)">We will never share your email.</p>
          )
        }
      </div>
    );
  }
}

export const WithValidation: Story = {
  name: "With Validation",
  render: () => <WithValidationDemo />,
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => (
    <div style="font-family:sans-serif;padding:24px;max-width:360px">
      <label for="input-disabled" style="display:block;font-size:.875rem;font-weight:500;color:var(--morphos-color-text);margin-bottom:6px">
        Username
      </label>
      <Input
        id="input-disabled"
        placeholder="Cannot edit this field"
        disabled
        class="morphos-input"
        aria-label="Disabled input"
      />
      <p style="margin:8px 0 0;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
        data-disabled=""
      </p>
    </div>
  ),
};

export const Readonly: Story = {
  name: "Readonly",
  render: () => (
    <div style="font-family:sans-serif;padding:24px;max-width:360px">
      <label for="input-readonly" style="display:block;font-size:.875rem;font-weight:500;color:var(--morphos-color-text);margin-bottom:6px">
        Account ID
      </label>
      <Input
        id="input-readonly"
        defaultValue="acc_1a2b3c4d5e6f"
        readonly
        class="morphos-input"
        aria-label="Readonly account ID"
      />
      <p style="margin:8px 0 0;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
        readonly — value selectable but not editable
      </p>
    </div>
  ),
};
