import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Radio, RadioGroup } from "@morphos/inputs";

// .rg-item provides [data-checked]/[data-disabled]/[data-orientation] state
// feedback that can't be expressed as an inline style — kept as a small
// scoped stylesheet rather than dropped or duplicated per-instance.
const RADIO_STYLE = `
  .rg-item { display:flex; align-items:flex-start; gap:10px; cursor:pointer; padding:10px 12px; border:1px solid var(--morphos-color-border); border-radius:8px; transition:border-color 0.15s, background 0.15s; }
  .rg-item[data-checked] { border-color:var(--morphos-color-accent); background:var(--morphos-color-bg-hover); }
  .rg-item[data-disabled] { opacity:0.5; cursor:not-allowed; }
  .rg-item[data-orientation="horizontal"] { flex:1; min-width:80px; }
`;

const meta: Meta = {
  title: "Inputs/RadioGroup",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Accessible radio group. `RadioGroup` owns the selected value state; child `Radio` components receive the group instance via the `group` prop and call `group.select()` on change. Styled here with the `@morphos/styles` `morphos-radio-group`/`morphos-radio` recipes, combined with a demo `rg-item` card wrapper.",
      },
    },
  },
};
export default meta;

type Story = StoryObj;

@Component()
class DefaultRadioDemo extends StatefulComponent {
  @State() group = new RadioGroup({ defaultValue: "pro", orientation: "vertical" });

  onBeforeMount() {
    this.group = new RadioGroup({ defaultValue: "pro", orientation: "vertical" });
    this.group.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px;max-width:420px">
        <style>{RADIO_STYLE}</style>
        <p style="margin:0 0 12px;font-size:.875rem;font-weight:600;color:var(--morphos-color-text)">Choose a plan</p>
        <RadioGroup class="morphos-radio-group" orientation="vertical" aria-label="Pricing plan">
          <Radio group={this.group} value="free" class="morphos-radio rg-item">
            <div>
              <div style="font-size:.875rem;font-weight:500;color:var(--morphos-color-text)">Free</div>
              <div style="font-size:.75rem;color:var(--morphos-color-text-muted);margin-top:1px">Up to 3 projects, community support</div>
            </div>
          </Radio>
          <Radio group={this.group} value="pro" class="morphos-radio rg-item">
            <div>
              <div style="font-size:.875rem;font-weight:500;color:var(--morphos-color-text)">Pro — $12/mo</div>
              <div style="font-size:.75rem;color:var(--morphos-color-text-muted);margin-top:1px">Unlimited projects, priority support</div>
            </div>
          </Radio>
          <Radio group={this.group} value="team" class="morphos-radio rg-item">
            <div>
              <div style="font-size:.875rem;font-weight:500;color:var(--morphos-color-text)">Team — $49/mo</div>
              <div style="font-size:.75rem;color:var(--morphos-color-text-muted);margin-top:1px">Up to 20 seats, admin controls</div>
            </div>
          </Radio>
          <Radio group={this.group} value="enterprise" class="morphos-radio rg-item">
            <div>
              <div style="font-size:.875rem;font-weight:500;color:var(--morphos-color-text)">Enterprise</div>
              <div style="font-size:.75rem;color:var(--morphos-color-text-muted);margin-top:1px">Custom pricing, SLA, dedicated support</div>
            </div>
          </Radio>
        </RadioGroup>
        <p style="margin:12px 0 0;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
          selected: "{() => this.group.selectedValue ?? "(none)"}"
        </p>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultRadioDemo />,
};

@Component()
class HorizontalRadioDemo extends StatefulComponent {
  @State() group = new RadioGroup({ defaultValue: "card", orientation: "horizontal" });

  onBeforeMount() {
    this.group = new RadioGroup({ defaultValue: "card", orientation: "horizontal" });
    this.group.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px;max-width:480px">
        <style>{RADIO_STYLE}</style>
        <p style="margin:0 0 12px;font-size:.875rem;font-weight:600;color:var(--morphos-color-text)">Payment method</p>
        <RadioGroup class="morphos-radio-group" orientation="horizontal" aria-label="Payment method">
          <Radio group={this.group} value="card" class="morphos-radio rg-item" data-orientation="horizontal">
            <div style="font-size:.875rem;font-weight:500;color:var(--morphos-color-text)">Card</div>
          </Radio>
          <Radio group={this.group} value="paypal" class="morphos-radio rg-item" data-orientation="horizontal">
            <div style="font-size:.875rem;font-weight:500;color:var(--morphos-color-text)">PayPal</div>
          </Radio>
          <Radio group={this.group} value="bank" class="morphos-radio rg-item" data-orientation="horizontal">
            <div style="font-size:.875rem;font-weight:500;color:var(--morphos-color-text)">Bank</div>
          </Radio>
        </RadioGroup>
        <p style="margin:12px 0 0;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
          data-orientation="horizontal" | selected: "{() => this.group.selectedValue ?? "(none)"}"
        </p>
      </div>
    );
  }
}

export const Horizontal: Story = {
  name: "Horizontal",
  render: () => <HorizontalRadioDemo />,
};

@Component()
class DisabledRadioDemo extends StatefulComponent {
  @State() group = new RadioGroup({ defaultValue: "pro", disabled: true, orientation: "vertical" });

  onBeforeMount() {
    this.group = new RadioGroup({ defaultValue: "pro", disabled: true, orientation: "vertical" });
    this.group.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px;max-width:420px">
        <style>{RADIO_STYLE}</style>
        <p style="margin:0 0 12px;font-size:.875rem;font-weight:600;color:var(--morphos-color-text)">Plan (read-only)</p>
        <RadioGroup class="morphos-radio-group" disabled orientation="vertical" aria-label="Disabled plan selector">
          <Radio group={this.group} value="free" class="morphos-radio rg-item">
            <div style="font-size:.875rem;font-weight:500;color:var(--morphos-color-text)">Free</div>
          </Radio>
          <Radio group={this.group} value="pro" class="morphos-radio rg-item">
            <div style="font-size:.875rem;font-weight:500;color:var(--morphos-color-text)">Pro</div>
          </Radio>
          <Radio group={this.group} value="enterprise" class="morphos-radio rg-item">
            <div style="font-size:.875rem;font-weight:500;color:var(--morphos-color-text)">Enterprise</div>
          </Radio>
        </RadioGroup>
        <p style="margin:12px 0 0;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
          data-disabled="" on group | all radios non-interactive
        </p>
      </div>
    );
  }
}

export const Disabled: Story = {
  name: "Disabled",
  render: () => <DisabledRadioDemo />,
};

@Component()
class ControlledRadioDemo extends StatefulComponent {
  @State() group = new RadioGroup({ orientation: "vertical" });
  @State() externalValue = "team";

  onBeforeMount() {
    this.group = new RadioGroup({ orientation: "vertical" });
    this.group.onBeforeMount?.();
    this.externalValue = "team";
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px;max-width:420px">
        <style>{RADIO_STYLE}</style>
        <p style="margin:0 0 12px;font-size:.875rem;font-weight:600;color:var(--morphos-color-text)">Plan (controlled)</p>
        <div style="display:flex;gap:8px;margin-bottom:16px">
          {(["free", "pro", "team", "enterprise"] as const).map((plan) => (
            <button
              class="morphos-button morphos-button--outline"
              onClick={() => { this.externalValue = plan; this.group.select(plan); }}
            >
              {plan}
            </button>
          ))}
        </div>
        <RadioGroup class="morphos-radio-group" value={() => this.externalValue} orientation="vertical" aria-label="Controlled plan">
          <Radio group={this.group} value="free" class="morphos-radio rg-item">
            <div style="font-size:.875rem;font-weight:500;color:var(--morphos-color-text)">Free</div>
          </Radio>
          <Radio group={this.group} value="pro" class="morphos-radio rg-item">
            <div style="font-size:.875rem;font-weight:500;color:var(--morphos-color-text)">Pro</div>
          </Radio>
          <Radio group={this.group} value="team" class="morphos-radio rg-item">
            <div style="font-size:.875rem;font-weight:500;color:var(--morphos-color-text)">Team</div>
          </Radio>
          <Radio group={this.group} value="enterprise" class="morphos-radio rg-item">
            <div style="font-size:.875rem;font-weight:500;color:var(--morphos-color-text)">Enterprise</div>
          </Radio>
        </RadioGroup>
        <p style="margin:12px 0 0;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
          externalValue: "{() => this.externalValue}"
        </p>
      </div>
    );
  }
}

export const Controlled: Story = {
  name: "Controlled",
  render: () => <ControlledRadioDemo />,
};
