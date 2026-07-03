import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { NumberField } from "@morphos/inputs";

const meta: Meta<{ min: number; max: number; step: number; defaultValue: number }> = {
  title: "Inputs/NumberField",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Numeric spinbutton input with increment/decrement controls. Supports clamping to min/max, arbitrary step, and Intl number formatting. Decrement/increment buttons disable automatically at boundaries. Styled here with the `@morphos/styles` `morphos-number-field` recipe.",
      },
    },
  },
  argTypes: {
    min: { control: { type: "number" } },
    max: { control: { type: "number" } },
    step: { control: { type: "number" } },
    defaultValue: { control: { type: "number" } },
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
  },
};
export default meta;

type Story = StoryObj<{ min: number; max: number; step: number; defaultValue: number }>;

export const Default: Story = {
  name: "Default",
  render: (args) => (
    <div style="font-family:sans-serif;padding:24px">
      <label for="nf-default" style="display:block;font-size:.875rem;font-weight:500;color:#374151;margin-bottom:8px">
        Value (min {args.min} – max {args.max}, step {args.step})
      </label>
      <NumberField
        id="nf-default"
        class="morphos-number-field"
        min={args.min}
        max={args.max}
        step={args.step}
        defaultValue={args.defaultValue}
        aria-label="Number field"
      />
    </div>
  ),
};

@Component()
class WithFormattingDemo extends StatefulComponent {
  @State() price = 29.99;

  onBeforeMount() {
    this.price = 29.99;
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px">
          <label for="nf-price" style="display:block;font-size:.875rem;font-weight:500;color:#374151;margin-bottom:8px">
          Price (USD)
        </label>
        <NumberField
          id="nf-price"
          class="morphos-number-field"
          defaultValue={29.99}
          min={0}
          step={0.01}
          formatOptions={{ style: "currency", currency: "USD" }}
          onValueChange={(val: number) => { this.price = val; }}
          aria-label="Price in USD"
        />
        <p style="margin:8px 0 0;font-size:.75rem;color:#6b7280;font-family:monospace">
          raw value: {() => this.price} | formatOptions: currency/USD
        </p>
      </div>
    );
  }
}

export const WithFormatting: Story = {
  name: "With Formatting",
  render: () => <WithFormattingDemo />,
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => (
    <div style="font-family:sans-serif;padding:24px">
      <label for="nf-quantity" style="display:block;font-size:.875rem;font-weight:500;color:#374151;margin-bottom:8px">
        Quantity (disabled)
      </label>
      <NumberField
        id="nf-quantity"
        class="morphos-number-field"
        defaultValue={42}
        disabled
        aria-label="Disabled number field"
      />
      <p style="margin:8px 0 0;font-size:.75rem;color:#6b7280;font-family:monospace">
        data-disabled="" — controls and input non-interactive
      </p>
    </div>
  ),
};

export const MinMax: Story = {
  name: "Min / Max Boundaries",
  render: () => (
    <div style="font-family:sans-serif;padding:24px">
      <label for="nf-rating" style="display:block;font-size:.875rem;font-weight:500;color:#374151;margin-bottom:8px">
        Rating (1 – 10)
      </label>
      <NumberField
        id="nf-rating"
        class="morphos-number-field"
        defaultValue={1}
        min={1}
        max={10}
        step={1}
        aria-label="Rating 1 to 10"
      />
      <p style="margin:8px 0 0;font-size:.75rem;color:#6b7280">
        Decrement disables at 1, increment disables at 10.
      </p>
    </div>
  ),
};
