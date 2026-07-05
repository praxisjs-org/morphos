import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Select } from "@morphos/inputs";

const COUNTRY_OPTIONS = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "br", label: "Brazil" },
];

const meta: Meta<{ placeholder: string; disabled: boolean }> = {
  title: "Inputs/Select",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Custom accessible select. Renders a styled combobox trigger and a keyboard-navigable listbox. Exposes `data-open`, `data-selected`, `data-active`, `data-disabled`, and `data-placeholder` for pure CSS styling. Styled here with the `@morphos/styles` `morphos-select` recipe.",
      },
    },
  },
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    placeholder: "Select a country…",
    disabled: false,
  },
};
export default meta;

type Story = StoryObj<{ placeholder: string; disabled: boolean }>;

@Component()
class DefaultSelectDemo extends StatefulComponent {
  @State() selected: string | undefined = undefined;

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px">
        <label style="display:block;font-size:.875rem;font-weight:500;color:var(--morphos-color-text);margin-bottom:6px">
          Country
        </label>
        <Select
          class="morphos-select"
          options={COUNTRY_OPTIONS}
          placeholder="Select a country…"
          onValueChange={(val: string) => { this.selected = val; }}
          aria-label="Country selector"
        />
        <p style="margin:8px 0 0;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
          selected: "{() => this.selected ?? "(none)"}"
        </p>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultSelectDemo />,
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => (
    <div style="font-family:sans-serif;padding:24px">
      <label style="display:block;font-size:.875rem;font-weight:500;color:var(--morphos-color-text);margin-bottom:6px">
        Country (disabled)
      </label>
      <Select
        class="morphos-select"
        options={COUNTRY_OPTIONS}
        defaultValue="de"
        disabled
        aria-label="Disabled country selector"
      />
      <p style="margin:8px 0 0;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
        data-disabled="" — trigger and listbox non-interactive
      </p>
    </div>
  ),
};

export const WithDefault: Story = {
  name: "With Default Value",
  render: () => (
    <div style="font-family:sans-serif;padding:24px">
      <label style="display:block;font-size:.875rem;font-weight:500;color:var(--morphos-color-text);margin-bottom:6px">
        Country
      </label>
      <Select
        class="morphos-select"
        options={COUNTRY_OPTIONS}
        defaultValue="ca"
        placeholder="Select a country…"
        aria-label="Country with default"
      />
      <p style="margin:8px 0 0;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
        defaultValue="ca" — uncontrolled, pre-selected
      </p>
    </div>
  ),
};

@Component()
class ControlledSelectDemo extends StatefulComponent {
  @State() value: string | undefined = "jp";

  onBeforeMount() {
    this.value = "jp";
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px">
        <label style="display:block;font-size:.875rem;font-weight:500;color:var(--morphos-color-text);margin-bottom:6px">
          Country (controlled)
        </label>
        <div style="display:flex;gap:8px;margin-bottom:12px;align-items:center">
          <Select
            class="morphos-select"
            options={COUNTRY_OPTIONS}
            value={() => this.value}
            onValueChange={(val: string) => { this.value = val; }}
            placeholder="Select a country…"
            aria-label="Controlled country selector"
          />
          <button
            class="morphos-button morphos-button--outline"
            onClick={() => { this.value = undefined; }}
          >
            Reset
          </button>
        </div>
        <p style="margin:0;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
          value: "{() => this.value ?? "(none)"}"
        </p>
      </div>
    );
  }
}

export const Controlled: Story = {
  name: "Controlled",
  render: () => <ControlledSelectDemo />,
};

@Component()
class ClearableSelectDemo extends StatefulComponent {
  @State() value: string | undefined = "us";

  onBeforeMount() {
    this.value = "us";
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px">
        <label style="display:block;font-size:.875rem;font-weight:500;color:var(--morphos-color-text);margin-bottom:6px">
          Country (clearable)
        </label>
        <Select
          class="morphos-select"
          options={COUNTRY_OPTIONS}
          value={() => this.value}
          onValueChange={(val: string) => { this.value = val; }}
          onClear={() => { this.value = undefined; }}
          clearable
          placeholder="Select a country…"
          aria-label="Clearable country selector"
        />
        <p style="margin:8px 0 0;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
          value: "{() => this.value ?? "(none)"}"
        </p>
      </div>
    );
  }
}

export const Clearable: Story = {
  name: "Clearable",
  render: () => <ClearableSelectDemo />,
};
