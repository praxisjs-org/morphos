import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { CheckboxGroup, CheckboxGroupItem } from "@morphos/inputs";

const meta: Meta = {
  title: "Inputs/CheckboxGroup",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Multi-select grouped checkboxes. `CheckboxGroup` owns the selection state; each `CheckboxGroupItem` receives the root instance via the `group` prop. Supports controlled and uncontrolled modes, orientation, and full-group disable. Styled here with the `@morphos/styles` `morphos-checkbox-group`/`morphos-checkbox-group-item` recipes.",
      },
    },
  },
};
export default meta;

type Story = StoryObj;

@Component()
class DefaultGroupDemo extends StatefulComponent {
  @State() group = new CheckboxGroup({ defaultValue: ["apple"], orientation: "vertical" });

  onBeforeMount() {
    this.group = new CheckboxGroup({ defaultValue: ["apple"], orientation: "vertical" });
    this.group.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px">
        <CheckboxGroup
          class="morphos-checkbox-group"
          defaultValue={["apple"]}
          orientation="vertical"
          aria-label="Fruit selection"
          onValueChange={(vals: string[]) => {
            this.group._value = vals;
          }}
        >
          <CheckboxGroupItem group={this.group} value="apple" class="morphos-checkbox-group-item">
            Apple
          </CheckboxGroupItem>
          <CheckboxGroupItem group={this.group} value="banana" class="morphos-checkbox-group-item">
            Banana
          </CheckboxGroupItem>
          <CheckboxGroupItem group={this.group} value="cherry" class="morphos-checkbox-group-item">
            Cherry
          </CheckboxGroupItem>
          <CheckboxGroupItem group={this.group} value="date" class="morphos-checkbox-group-item">
            Date
          </CheckboxGroupItem>
        </CheckboxGroup>
        <div style="font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace;background:var(--morphos-color-bg-subtle);padding:5px 10px;border-radius:4px;margin-top:10px">
          Selected ({() => String(this.group._value.length)}
          ): [{() => this.group._value.join(", ")}]
        </div>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultGroupDemo />,
};

@Component()
class HorizontalGroupDemo extends StatefulComponent {
  @State() group = new CheckboxGroup({ defaultValue: ["red"], orientation: "horizontal" });

  onBeforeMount() {
    this.group = new CheckboxGroup({ defaultValue: ["red"], orientation: "horizontal" });
    this.group.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px">
        <CheckboxGroup
          class="morphos-checkbox-group"
          defaultValue={["red"]}
          orientation="horizontal"
          aria-label="Color selection"
          onValueChange={(vals: string[]) => {
            this.group._value = vals;
          }}
        >
          <CheckboxGroupItem group={this.group} value="red" class="morphos-checkbox-group-item">
            Red
          </CheckboxGroupItem>
          <CheckboxGroupItem group={this.group} value="green" class="morphos-checkbox-group-item">
            Green
          </CheckboxGroupItem>
          <CheckboxGroupItem group={this.group} value="blue" class="morphos-checkbox-group-item">
            Blue
          </CheckboxGroupItem>
          <CheckboxGroupItem group={this.group} value="yellow" class="morphos-checkbox-group-item">
            Yellow
          </CheckboxGroupItem>
        </CheckboxGroup>
        <div style="font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace;background:var(--morphos-color-bg-subtle);padding:5px 10px;border-radius:4px;margin-top:10px">
          orientation="horizontal" | selected: [{() => this.group._value.join(", ")}]
        </div>
      </div>
    );
  }
}

export const Horizontal: Story = {
  name: "Horizontal",
  render: () => <HorizontalGroupDemo />,
};

@Component()
class DisabledGroupDemo extends StatefulComponent {
  @State() group = new CheckboxGroup({
    defaultValue: ["apple", "cherry"],
    disabled: true,
    orientation: "vertical",
  });

  onBeforeMount() {
    this.group = new CheckboxGroup({
      defaultValue: ["apple", "cherry"],
      disabled: true,
      orientation: "vertical",
    });
    this.group.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px">
        <CheckboxGroup
          class="morphos-checkbox-group"
          defaultValue={["apple", "cherry"]}
          disabled
          orientation="vertical"
          aria-label="Disabled fruit selection"
        >
          <CheckboxGroupItem group={this.group} value="apple" class="morphos-checkbox-group-item">
            Apple
          </CheckboxGroupItem>
          <CheckboxGroupItem group={this.group} value="banana" class="morphos-checkbox-group-item">
            Banana
          </CheckboxGroupItem>
          <CheckboxGroupItem group={this.group} value="cherry" class="morphos-checkbox-group-item">
            Cherry
          </CheckboxGroupItem>
          <CheckboxGroupItem group={this.group} value="date" class="morphos-checkbox-group-item">
            Date
          </CheckboxGroupItem>
        </CheckboxGroup>
        <div style="font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace;background:var(--morphos-color-bg-subtle);padding:5px 10px;border-radius:4px;margin-top:10px">
          data-disabled="" on group — all items non-interactive
        </div>
      </div>
    );
  }
}

export const Disabled: Story = {
  name: "Disabled",
  render: () => <DisabledGroupDemo />,
};

@Component()
class ControlledGroupDemo extends StatefulComponent {
  @State() selected: string[] = ["banana"];
  @State() group = new CheckboxGroup({ defaultValue: ["banana"], orientation: "vertical" });

  onBeforeMount() {
    this.selected = ["banana"];
    this.group = new CheckboxGroup({ defaultValue: ["banana"], orientation: "vertical" });
    this.group.onBeforeMount?.();
  }

  private _toggle(val: string) {
    const next = this.selected.includes(val)
      ? this.selected.filter((v) => v !== val)
      : [...this.selected, val];
    this.selected = next;
    this.group._value = next;
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px">
        <p style="margin:0 0 12px;font-size:.875rem;color:var(--morphos-color-text)">
          External controls toggle items without interacting with the checkboxes
          directly.
        </p>
        <CheckboxGroup
          class="morphos-checkbox-group"
          value={this.selected}
          orientation="vertical"
          aria-label="Controlled fruit selection"
          onValueChange={(vals: string[]) => {
            this.selected = vals;
            this.group._value = vals;
          }}
        >
          <CheckboxGroupItem group={this.group} value="apple" class="morphos-checkbox-group-item">
            Apple
          </CheckboxGroupItem>
          <CheckboxGroupItem group={this.group} value="banana" class="morphos-checkbox-group-item">
            Banana
          </CheckboxGroupItem>
          <CheckboxGroupItem group={this.group} value="cherry" class="morphos-checkbox-group-item">
            Cherry
          </CheckboxGroupItem>
          <CheckboxGroupItem group={this.group} value="date" class="morphos-checkbox-group-item">
            Date
          </CheckboxGroupItem>
        </CheckboxGroup>
        <div style="margin-top:12px;display:flex;gap:6px;flex-wrap:wrap">
          {["apple", "banana", "cherry", "date"].map((fruit) => (
            <button
              key={fruit}
              class="morphos-button morphos-button--outline"
              onClick={() => {
                this._toggle(fruit);
              }}
            >
              Toggle {fruit}
            </button>
          ))}
        </div>
        <div style="font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace;background:var(--morphos-color-bg-subtle);padding:5px 10px;border-radius:4px;margin-top:10px">
          value={`[${this.selected.join(", ")}]`} — controlled externally
        </div>
      </div>
    );
  }
}

export const Controlled: Story = {
  name: "Controlled",
  render: () => <ControlledGroupDemo />,
};
