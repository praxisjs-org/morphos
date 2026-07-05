import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { CheckboxGroup, CheckboxGroupItem, Fieldset } from "@morphos/inputs";

const meta: Meta = {
  title: "Inputs/Fieldset",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Semantic grouping primitive that renders a `<fieldset>` with an optional `<legend>`. Accepts a `disabled` prop that natively disables all child form controls and adds `data-disabled` for CSS styling. Styled here with the `@morphos/styles` `morphos-fieldset` recipe.",
      },
    },
  },
  argTypes: {
    disabled: { control: "boolean" },
    legend: { control: "text" },
  },
  args: {
    disabled: false,
    legend: "Notification channels",
  },
};
export default meta;

type Story = StoryObj<{ disabled: boolean; legend: string }>;

@Component()
class DefaultFieldsetDemo extends StatefulComponent {
  @State() group = new CheckboxGroup({ defaultValue: ["email"], orientation: "vertical" });

  onBeforeMount() {
    this.group = new CheckboxGroup({ defaultValue: ["email"], orientation: "vertical" });
    this.group.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px;max-width:420px">
        <Fieldset class="morphos-fieldset" legend="Notification channels">
          <CheckboxGroup
            class="morphos-checkbox-group"
            defaultValue={["email"]}
            orientation="vertical"
            aria-label="Notification channels"
            onValueChange={(vals: string[]) => {
              this.group._value = vals;
            }}
          >
            <CheckboxGroupItem group={this.group} value="email" class="morphos-checkbox-group-item">
              Email notifications
            </CheckboxGroupItem>
            <CheckboxGroupItem group={this.group} value="sms" class="morphos-checkbox-group-item">
              SMS notifications
            </CheckboxGroupItem>
            <CheckboxGroupItem group={this.group} value="push" class="morphos-checkbox-group-item">
              Push notifications
            </CheckboxGroupItem>
            <CheckboxGroupItem group={this.group} value="slack" class="morphos-checkbox-group-item">
              Slack notifications
            </CheckboxGroupItem>
          </CheckboxGroup>
        </Fieldset>
        <div style="font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace;background:var(--morphos-color-bg-subtle);padding:5px 10px;border-radius:4px;margin-top:8px">
          selected: [{() => this.group._value.join(", ")}]
        </div>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultFieldsetDemo />,
};

@Component()
class DisabledFieldsetDemo extends StatefulComponent {
  @State() group = new CheckboxGroup({
    defaultValue: ["email", "push"],
    disabled: true,
    orientation: "vertical",
  });

  onBeforeMount() {
    this.group = new CheckboxGroup({
      defaultValue: ["email", "push"],
      disabled: true,
      orientation: "vertical",
    });
    this.group.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px;max-width:420px">
        <Fieldset class="morphos-fieldset" disabled legend="Locked settings">
          <CheckboxGroup
            class="morphos-checkbox-group"
            defaultValue={["email", "push"]}
            disabled
            orientation="vertical"
            aria-label="Locked notification settings"
          >
            <CheckboxGroupItem group={this.group} value="email" class="morphos-checkbox-group-item">
              Email (locked)
            </CheckboxGroupItem>
            <CheckboxGroupItem group={this.group} value="sms" class="morphos-checkbox-group-item">
              SMS (locked)
            </CheckboxGroupItem>
            <CheckboxGroupItem group={this.group} value="push" class="morphos-checkbox-group-item">
              Push (locked)
            </CheckboxGroupItem>
          </CheckboxGroup>
        </Fieldset>
        <div style="font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace;background:var(--morphos-color-bg-subtle);padding:5px 10px;border-radius:4px;margin-top:8px">
          disabled prop on fieldset | data-disabled="" | all controls non-interactive
        </div>
      </div>
    );
  }
}

export const Disabled: Story = {
  name: "Disabled",
  render: () => <DisabledFieldsetDemo />,
};
