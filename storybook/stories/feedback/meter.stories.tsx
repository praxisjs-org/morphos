import { StatefulComponent } from "@praxisjs/core";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Meter } from "@morphos/feedback";

const METER_STYLE = `
  .meter-row   { margin-bottom: 18px; font-family: sans-serif }
  .meter-label { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: .875rem; color: #374151 }
  .meter-label small { color: #9ca3af }
`;

type Args = {
  value: number;
  min: number;
  max: number;
  low: number;
  high: number;
};

const meta: Meta<Args> = {
  title: "Feedback/Meter",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Scalar gauge with `data-low` / `data-high` / `data-optimum` attributes for pure-CSS " +
          "colour coding. The `--meter-value` CSS custom property carries the percentage so you " +
          "can style the track fill without JavaScript. Styled here with the `@morphos/styles` `morphos-meter` recipe.",
      },
    },
  },
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Current measurement value.",
    },
    min: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Lower bound of the gauge.",
    },
    max: {
      control: { type: "range", min: 1, max: 200, step: 1 },
      description: "Upper bound of the gauge.",
    },
    low: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Threshold below which the value is considered low (sets data-low).",
    },
    high: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Threshold above which the value is considered high (sets data-high).",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

// ---------- Default — all controls wired ----------

export const Default: Story = {
  name: "Default",
  args: {
    value: 72,
    min: 0,
    max: 100,
    low: 60,
    high: 80,
  },
  render: (args) => (
    <div style="font-family:sans-serif;max-width:400px;padding:24px">
      <style>{METER_STYLE}</style>
      <div class="meter-row">
        <div class="meter-label">
          <span>Measurement</span>
          <small>{args.value} / {args.max}</small>
        </div>
        <Meter
          class="morphos-meter"
          value={args.value}
          min={args.min}
          max={args.max}
          low={args.low}
          high={args.high}
          aria-label="Measurement"
        />
      </div>
      <p style="margin:0;font-size:.75rem;font-family:monospace;color:#9ca3af">
        data-low toggles below {args.low} · data-high toggles above {args.high}
      </p>
    </div>
  ),
};

// ---------- Battery — controls: low + high ----------

@Component()
class BatteryDemo extends StatefulComponent {
  @Prop() low = 20;
  @Prop() high = 80;

  render() {
    const levels = [
      { value: 92, label: "Battery (full)", sub: "92% — optimal" },
      { value: 55, label: "Battery (medium)", sub: "55% — ok" },
      { value: 14, label: "Battery (low)", sub: "14% — critical" },
    ];
    return (
      <div style="font-family:sans-serif;max-width:400px;padding:24px">
        <style>{METER_STYLE}</style>
        {levels.map(({ value, label, sub }) => (
          <div class="meter-row" key={label}>
            <div class="meter-label">
              <span>{label}</span>
              <small>{sub}</small>
            </div>
            <Meter
              class="morphos-meter"
              value={value}
              min={0}
              max={100}
              low={() => this.low}
              high={() => this.high}
              aria-label={label}
            />
          </div>
        ))}
        <p style="margin:8px 0 0;font-size:.75rem;font-family:monospace;color:#9ca3af">
          low={String(this.low)} high={String(this.high)} — adjust via controls
        </p>
      </div>
    );
  }
}

export const Battery: Story = {
  name: "Battery",
  argTypes: {
    value: { table: { disable: true } },
    min: { table: { disable: true } },
    max: { table: { disable: true } },
  },
  args: {
    low: 20,
    high: 80,
  },
  render: (args) => <BatteryDemo low={args.low} high={args.high} />,
};

// ---------- DiskUsage — interactive buttons + low/high controls ----------

@Component()
class DiskUsageDemo extends StatefulComponent {
  @Prop() low = 60;
  @Prop() high = 80;
  @State() used = 0;

  onBeforeMount() {
    this.used = 55;
  }

  get label(): string {
    if (this.used > (this.high ?? 80)) return "critical";
    if (this.used > (this.low ?? 60)) return "warning";
    return "ok";
  }

  render() {
    return (
      <div style="font-family:sans-serif;max-width:400px;padding:24px">
        <style>{METER_STYLE}</style>
        <div class="meter-row">
          <div class="meter-label">
            <span>Disk usage</span>
            <small>{() => String(this.used)}% — {() => this.label}</small>
          </div>
          <Meter
            class="morphos-meter"
            value={() => this.used}
            min={0}
            max={100}
            low={() => this.low}
            high={() => this.high}
            aria-label="Disk usage"
          />
        </div>
        <div style="display:flex;gap:8px;margin-top:4px">
          <button
            type="button"
            class="morphos-button morphos-button--outline"
            onClick={() => { this.used = Math.max(0, this.used - 10); }}
          >
            −10 GB
          </button>
          <button
            type="button"
            class="morphos-button morphos-button--outline"
            onClick={() => { this.used = Math.min(100, this.used + 10); }}
          >
            +10 GB
          </button>
          <button
            type="button"
            class="morphos-button morphos-button--outline"
            onClick={() => { this.used = 55; }}
          >
            Reset
          </button>
        </div>
        <div style="margin-top:16px;padding:10px 14px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;font-size:.78rem;color:#0369a1">
          Cross the <code>low</code> ({() => String(this.low)}%) or <code>high</code> ({() => String(this.high)}%)
          thresholds to see the fill colour change. Adjust the thresholds via controls.
        </div>
      </div>
    );
  }
}

export const DiskUsage: Story = {
  name: "Disk usage (interactive)",
  argTypes: {
    value: { table: { disable: true } },
    min: { table: { disable: true } },
    max: { table: { disable: true } },
  },
  args: {
    low: 60,
    high: 80,
  },
  render: (args) => <DiskUsageDemo low={args.low} high={args.high} />,
};
