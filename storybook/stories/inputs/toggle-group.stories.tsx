import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { ToggleGroup, ToggleGroupItem } from "@morphos/inputs";

const meta: Meta = {
  title: "Inputs/ToggleGroup",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Grouped toggle buttons supporting `type='single'` (mutually exclusive) or `type='multiple'` (independent). Child `ToggleGroupItem` components receive the group instance via the `group` prop. Styled here with the `@morphos/styles` `morphos-toggle-group`/`morphos-toggle-group-item` recipes.",
      },
    },
  },
};
export default meta;

type Story = StoryObj;

@Component()
class SingleDemo extends StatefulComponent {
  @State() group = new ToggleGroup({ type: "single", defaultValue: "center", orientation: "horizontal" });

  onBeforeMount() {
    this.group = new ToggleGroup({ type: "single", defaultValue: "center", orientation: "horizontal" });
    this.group.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px">
        <p style="margin:0 0 10px;font-size:.875rem;font-weight:500;color:var(--morphos-color-text)">Text alignment</p>
        <ToggleGroup class="morphos-toggle-group" type="single" orientation="horizontal" aria-label="Text alignment">
          <ToggleGroupItem class="morphos-toggle-group-item" group={this.group} value="left" aria-label="Align left">Left</ToggleGroupItem>
          <ToggleGroupItem class="morphos-toggle-group-item" group={this.group} value="center" aria-label="Align center">Center</ToggleGroupItem>
          <ToggleGroupItem class="morphos-toggle-group-item" group={this.group} value="right" aria-label="Align right">Right</ToggleGroupItem>
        </ToggleGroup>
        <p style="margin:10px 0 0;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
          type="single" | selected: "{() => String(this.group._value ?? "(none)")}"
        </p>
      </div>
    );
  }
}

export const Single: Story = {
  name: "Single",
  render: () => <SingleDemo />,
};

@Component()
class MultipleDemo extends StatefulComponent {
  @State() group = new ToggleGroup({ type: "multiple", orientation: "horizontal" });

  onBeforeMount() {
    this.group = new ToggleGroup({ type: "multiple", orientation: "horizontal" });
    this.group.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px">
        <p style="margin:0 0 10px;font-size:.875rem;font-weight:500;color:var(--morphos-color-text)">Text formatting</p>
        <ToggleGroup class="morphos-toggle-group" type="multiple" orientation="horizontal" aria-label="Text formatting">
          <ToggleGroupItem class="morphos-toggle-group-item" group={this.group} value="bold" aria-label="Bold">
            <strong>B</strong>
          </ToggleGroupItem>
          <ToggleGroupItem class="morphos-toggle-group-item" group={this.group} value="italic" aria-label="Italic">
            <em>I</em>
          </ToggleGroupItem>
          <ToggleGroupItem class="morphos-toggle-group-item" group={this.group} value="underline" aria-label="Underline">
            <span style="text-decoration:underline">U</span>
          </ToggleGroupItem>
          <ToggleGroupItem class="morphos-toggle-group-item" group={this.group} value="strike" aria-label="Strikethrough">
            <span style="text-decoration:line-through">S</span>
          </ToggleGroupItem>
        </ToggleGroup>
        <p style="margin:10px 0 0;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
          type="multiple" | active: [{() => Array.isArray(this.group._value) ? (this.group._value.join(", ") || "none") : "none"}]
        </p>
      </div>
    );
  }
}

export const Multiple: Story = {
  name: "Multiple",
  render: () => <MultipleDemo />,
};

@Component()
class HorizontalDemo extends StatefulComponent {
  @State() group = new ToggleGroup({ type: "single", defaultValue: "grid", orientation: "horizontal" });

  onBeforeMount() {
    this.group = new ToggleGroup({ type: "single", defaultValue: "grid", orientation: "horizontal" });
    this.group.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px">
        <p style="margin:0 0 10px;font-size:.875rem;font-weight:500;color:var(--morphos-color-text)">View mode</p>
        <ToggleGroup class="morphos-toggle-group" type="single" orientation="horizontal" aria-label="View mode">
          <ToggleGroupItem class="morphos-toggle-group-item" group={this.group} value="list" aria-label="List view">List</ToggleGroupItem>
          <ToggleGroupItem class="morphos-toggle-group-item" group={this.group} value="grid" aria-label="Grid view">Grid</ToggleGroupItem>
          <ToggleGroupItem class="morphos-toggle-group-item" group={this.group} value="kanban" aria-label="Kanban view">Kanban</ToggleGroupItem>
        </ToggleGroup>
        <p style="margin:10px 0 0;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
          data-orientation="horizontal" | view: "{() => String(this.group._value ?? "none")}"
        </p>
      </div>
    );
  }
}

export const Horizontal: Story = {
  name: "Horizontal",
  render: () => <HorizontalDemo />,
};

@Component()
class VerticalDemo extends StatefulComponent {
  @State() group = new ToggleGroup({ type: "single", defaultValue: "medium", orientation: "vertical" });

  onBeforeMount() {
    this.group = new ToggleGroup({ type: "single", defaultValue: "medium", orientation: "vertical" });
    this.group.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px">
        <p style="margin:0 0 10px;font-size:.875rem;font-weight:500;color:var(--morphos-color-text)">Font size</p>
        <ToggleGroup class="morphos-toggle-group" type="single" orientation="vertical" aria-label="Font size">
          <ToggleGroupItem class="morphos-toggle-group-item" group={this.group} value="small">Small</ToggleGroupItem>
          <ToggleGroupItem class="morphos-toggle-group-item" group={this.group} value="medium">Medium</ToggleGroupItem>
          <ToggleGroupItem class="morphos-toggle-group-item" group={this.group} value="large">Large</ToggleGroupItem>
        </ToggleGroup>
        <p style="margin:10px 0 0;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
          data-orientation="vertical" | selected: "{() => String(this.group._value ?? "none")}"
        </p>
      </div>
    );
  }
}

export const Vertical: Story = {
  name: "Vertical",
  render: () => <VerticalDemo />,
};

@Component()
class DisabledGroupDemo extends StatefulComponent {
  @State() group = new ToggleGroup({ type: "multiple", disabled: true, orientation: "horizontal" });

  onBeforeMount() {
    this.group = new ToggleGroup({ type: "multiple", disabled: true, orientation: "horizontal" });
    this.group.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px">
        <p style="margin:0 0 10px;font-size:.875rem;font-weight:500;color:var(--morphos-color-text)">
          Formatting (disabled)
        </p>
        <ToggleGroup class="morphos-toggle-group" type="multiple" disabled orientation="horizontal" aria-label="Disabled formatting">
          <ToggleGroupItem class="morphos-toggle-group-item" group={this.group} value="bold"><strong>B</strong></ToggleGroupItem>
          <ToggleGroupItem class="morphos-toggle-group-item" group={this.group} value="italic"><em>I</em></ToggleGroupItem>
          <ToggleGroupItem class="morphos-toggle-group-item" group={this.group} value="underline">
            <span style="text-decoration:underline">U</span>
          </ToggleGroupItem>
        </ToggleGroup>
        <p style="margin:10px 0 0;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
          data-disabled="" on group — all items non-interactive
        </p>
      </div>
    );
  }
}

export const Disabled: Story = {
  name: "Disabled",
  render: () => <DisabledGroupDemo />,
};
