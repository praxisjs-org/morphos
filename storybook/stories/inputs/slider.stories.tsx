import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Slider } from "@morphos/inputs";

const meta: Meta<{ min: number; max: number; step: number; defaultValue: number; disabled: boolean }> = {
  title: "Inputs/Slider",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Range slider. Uses a native `<input type='range'>` inside a wrapper that exposes `--slider-value` as a CSS custom property, so the filled portion of the track can be painted directly on the input. Exposes `data-disabled`, `data-orientation`, and `data-value`. Styled here with the `@morphos/styles` `morphos-slider` recipe.",
      },
    },
  },
  argTypes: {
    min: { control: { type: "number" } },
    max: { control: { type: "number" } },
    step: { control: { type: "number" } },
    defaultValue: { control: { type: "number" } },
    disabled: { control: "boolean" },
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    disabled: false,
  },
};
export default meta;

type Story = StoryObj<{ min: number; max: number; step: number; defaultValue: number; disabled: boolean }>;

@Component()
class DefaultSliderDemo extends StatefulComponent {
  @State() value = 50;

  onBeforeMount() {
    this.value = 50;
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px;max-width:400px">
        <div style="display:flex;justify-content:space-between;font-size:.875rem;color:#374151;margin-bottom:4px">
          <span>Value</span>
          <span style="font-weight:600;color:#6d5bbd;font-variant-numeric:tabular-nums;min-width:3ch;text-align:right">{() => this.value}</span>
        </div>
        <Slider
          class="morphos-slider"
          min={0}
          max={100}
          step={1}
          defaultValue={50}
          onValueChange={(val: number) => { this.value = val; }}
          aria-label="Slider"
        />
        <p style="margin:8px 0 0;font-size:.75rem;color:#6b7280;font-family:monospace">
          min=0 max=100 step=1 | value: {() => this.value}
        </p>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultSliderDemo />,
};

@Component()
class SteppedSliderDemo extends StatefulComponent {
  @State() value = 50;

  onBeforeMount() {
    this.value = 50;
  }

  private get _label(): string {
    if (this.value === 0) return "Low";
    if (this.value === 25) return "Medium-low";
    if (this.value === 50) return "Medium";
    if (this.value === 75) return "Medium-high";
    return "High";
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px;max-width:400px">
        <div style="display:flex;justify-content:space-between;font-size:.875rem;color:#374151;margin-bottom:4px">
          <span>Quality</span>
          <span style="font-weight:600;color:#6d5bbd">{() => this._label}</span>
        </div>
        <Slider
          class="morphos-slider"
          min={0}
          max={100}
          step={25}
          defaultValue={50}
          onValueChange={(val: number) => { this.value = val; }}
          aria-label="Quality level"
        />
        <div style="display:flex;justify-content:space-between;font-size:.6875rem;color:#9ca3af;margin-top:4px">
          <span>Low</span>
          <span>Med</span>
          <span>High</span>
        </div>
        <p style="margin:8px 0 0;font-size:.75rem;color:#6b7280;font-family:monospace">
          step=25 | value: {() => this.value}
        </p>
      </div>
    );
  }
}

export const Stepped: Story = {
  name: "Stepped",
  render: () => <SteppedSliderDemo />,
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => (
    <div style="font-family:sans-serif;padding:24px;max-width:400px">
      <div style="display:flex;justify-content:space-between;font-size:.875rem;color:#374151;margin-bottom:4px">
        <span>Volume</span>
        <span style="font-weight:600;color:#9ca3af">40</span>
      </div>
      <Slider
        class="morphos-slider"
        defaultValue={40}
        min={0}
        max={100}
        disabled
        aria-label="Disabled slider"
      />
      <p style="margin:8px 0 0;font-size:.75rem;color:#6b7280;font-family:monospace">
        data-disabled="" — non-interactive
      </p>
    </div>
  ),
};

@Component()
class RangeSliderDemo extends StatefulComponent {
  @State() temp = 22;

  onBeforeMount() {
    this.temp = 22;
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px;max-width:400px">
        <div style="display:flex;justify-content:space-between;font-size:.875rem;color:#374151;margin-bottom:4px">
          <span>Temperature</span>
          <span style="font-weight:600;color:#6d5bbd;font-variant-numeric:tabular-nums;min-width:4ch;text-align:right">{() => this.temp.toFixed(1)}°C</span>
        </div>
        <Slider
          class="morphos-slider"
          min={10}
          max={30}
          step={0.5}
          defaultValue={22}
          onValueChange={(val: number) => { this.temp = val; }}
          aria-label="Room temperature"
        />
        <div style="display:flex;justify-content:space-between;font-size:.6875rem;color:#9ca3af;margin-top:4px">
          <span>10°C</span>
          <span>20°C</span>
          <span>30°C</span>
        </div>
        <p style="margin:8px 0 0;font-size:.75rem;color:#6b7280;font-family:monospace">
          min=10 max=30 step=0.5 | value: {() => this.temp.toFixed(1)}
        </p>
      </div>
    );
  }
}

export const Range: Story = {
  name: "Range",
  render: () => <RangeSliderDemo />,
};
