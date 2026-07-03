import { StatefulComponent } from "@praxisjs/core";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Field, FieldControl, FieldDescription, FieldError, FieldLabel } from "@morphos/inputs";

const SHARED_STYLE = `
  .fd-wrap { font-family:sans-serif; padding:24px; max-width:420px; }
  .fd-status { font-size:.75rem; color:#6b7280; font-family:monospace; background:#f9fafb; padding:5px 10px; border-radius:4px; margin-top:8px; }
`;

const meta: Meta = {
  title: "Inputs/Field",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Accessible form field wrapper. `Field` generates stable IDs and wires `FieldLabel`, `FieldDescription`, and `FieldError` together. `FieldError` renders only when `field.invalid` is true. Exposes `data-invalid`, `data-disabled`, and `data-required` on the root element. Styled here with the `@morphos/styles` `morphos-field` recipe family.",
      },
    },
  },
  argTypes: {
    invalid: { control: "boolean" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    invalid: false,
    required: false,
    disabled: false,
  },
};
export default meta;

type Story = StoryObj<{ invalid: boolean; required: boolean; disabled: boolean }>;

@Component()
class DefaultFieldDemo extends StatefulComponent {
  @Prop() invalid = false;
  @Prop() required = false;
  @Prop() disabled = false;

  @State() field = new Field();

  onBeforeMount() {
    this.field = new Field({ invalid: this.invalid, required: this.required, disabled: this.disabled });
    this.field.onBeforeMount?.();
  }

  render() {
    return (
      <div class="fd-wrap">
        <style>{SHARED_STYLE}</style>
        <Field class="morphos-field" invalid={this.invalid} required={this.required} disabled={this.disabled}>
          <FieldLabel field={this.field} class="morphos-field-label">Email address</FieldLabel>
          <FieldControl class="morphos-field-control">
            <input
              id={this.field.fieldId}
              type="email"
              class="morphos-input"
              placeholder="you@example.com"
              disabled={this.disabled}
            />
          </FieldControl>
          <FieldDescription field={this.field} class="morphos-field-description">
            We'll never share your email with anyone.
          </FieldDescription>
          <FieldError field={this.field} class="morphos-field-error">
            Please enter a valid email address.
          </FieldError>
        </Field>
        <div class="fd-status">
          invalid={String(this.invalid)} | required={String(this.required)} |
          disabled={String(this.disabled)}
        </div>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: (args) => (
    <DefaultFieldDemo
      invalid={args.invalid}
      required={args.required}
      disabled={args.disabled}
    />
  ),
};

@Component()
class WithErrorFieldDemo extends StatefulComponent {
  @State() field = new Field();

  onBeforeMount() {
    this.field = new Field({ invalid: true, required: true });
    this.field.onBeforeMount?.();
  }

  render() {
    return (
      <div class="fd-wrap">
        <style>{SHARED_STYLE}</style>
        <Field class="morphos-field" invalid={true} required={true}>
          <FieldLabel field={this.field} class="morphos-field-label">Username</FieldLabel>
          <FieldControl class="morphos-field-control">
            <input
              id={this.field.fieldId}
              type="text"
              class="morphos-input"
              aria-invalid="true"
              value="ab"
              placeholder="Enter username"
            />
          </FieldControl>
          <FieldDescription field={this.field} class="morphos-field-description">
            Must be at least 3 characters.
          </FieldDescription>
          <FieldError field={this.field} class="morphos-field-error">
            &#9888; Username is too short (minimum 3 characters).
          </FieldError>
        </Field>
        <div class="fd-status">
          invalid=true | FieldError renders because field.invalid is true
        </div>
      </div>
    );
  }
}

export const WithError: Story = {
  name: "With Error",
  render: () => <WithErrorFieldDemo />,
};

@Component()
class RequiredFieldDemo extends StatefulComponent {
  @State() field = new Field();

  onBeforeMount() {
    this.field = new Field({ required: true });
    this.field.onBeforeMount?.();
  }

  render() {
    return (
      <div class="fd-wrap">
        <style>{SHARED_STYLE}</style>
        <Field class="morphos-field" required={true}>
          <FieldLabel field={this.field} class="morphos-field-label">Full name</FieldLabel>
          <FieldControl class="morphos-field-control">
            <input
              id={this.field.fieldId}
              type="text"
              class="morphos-input"
              placeholder="Full Name"
              required
            />
          </FieldControl>
          <FieldDescription field={this.field} class="morphos-field-description">
            Your legal full name as it appears on ID.
          </FieldDescription>
        </Field>
        <div class="fd-status">
          required=true | label gets "&#42;" via the morphos-field recipe's [data-required] selector
        </div>
      </div>
    );
  }
}

export const Required: Story = {
  name: "Required",
  render: () => <RequiredFieldDemo />,
};
