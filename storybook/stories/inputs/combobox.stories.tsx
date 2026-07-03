import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Combobox } from "@morphos/inputs";

const COUNTRY_OPTIONS = [
  { value: "br", label: "Brazil" },
  { value: "us", label: "United States" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "cn", label: "China" },
  { value: "in", label: "India" },
  { value: "gb", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
];

const OPTIONS_WITH_DISABLED = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular", disabled: true },
  { value: "svelte", label: "Svelte" },
  { value: "solidjs", label: "SolidJS" },
  { value: "praxisjs", label: "PraxisJS" },
  { value: "qwik", label: "Qwik", disabled: true },
  { value: "lit", label: "Lit" },
];

const SHARED_STYLE = `
  .cmb-wrap { font-family:sans-serif; padding:24px; max-width:360px; }
  .cmb-label { display:block; font-size:.875rem; font-weight:500; color:#374151; margin-bottom:6px; }
  .cmb-status { font-size:.75rem; color:#6b7280; font-family:monospace; background:#f9fafb; padding:5px 10px; border-radius:4px; margin-top:8px; }
`;

const meta: Meta = {
  title: "Inputs/Combobox",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Searchable dropdown selector. The user types to filter options, then selects one with keyboard or click. Supports controlled / uncontrolled value, per-option `disabled`, and exposes `data-open`, `data-selected`, `data-active`, `data-disabled` for CSS. Styled here with the `@morphos/styles` `morphos-combobox` recipe.",
      },
    },
  },
};
export default meta;

type Story = StoryObj;

@Component()
class DefaultComboboxDemo extends StatefulComponent {
  @State() selected: string | undefined = undefined;

  onBeforeMount() {
    this.selected = undefined;
  }

  render() {
    return (
      <div class="cmb-wrap">
        <style>{SHARED_STYLE}</style>
        <label class="cmb-label" for="cmb-country">
          Country
        </label>
        <Combobox
          class="morphos-combobox"
          options={COUNTRY_OPTIONS}
          placeholder="Search a country…"
          onValueChange={(val: string) => {
            this.selected = val;
          }}
          id="cmb-country"
          name="country"
          aria-label="Select country"
        />
        <div class="cmb-status">
          selected: "{() => this.selected ?? "(none)"}"
        </div>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultComboboxDemo />,
};

@Component()
class WithDisabledOptionsDemo extends StatefulComponent {
  @State() selected: string | undefined = undefined;

  onBeforeMount() {
    this.selected = undefined;
  }

  render() {
    return (
      <div class="cmb-wrap">
        <style>{SHARED_STYLE}</style>
        <label class="cmb-label" for="cmb-fw">
          Framework
        </label>
        <p style="margin:0 0 8px;font-size:.8125rem;color:#6b7280">
          Angular and Qwik are disabled options.
        </p>
        <Combobox
          class="morphos-combobox"
          options={OPTIONS_WITH_DISABLED}
          placeholder="Search a framework…"
          onValueChange={(val: string) => {
            this.selected = val;
          }}
          id="cmb-fw"
          aria-label="Select framework"
        />
        <div class="cmb-status">
          selected: "{() => this.selected ?? "(none)"}" | some options
          data-disabled=""
        </div>
      </div>
    );
  }
}

export const WithDisabledOptions: Story = {
  name: "With Disabled Options",
  render: () => <WithDisabledOptionsDemo />,
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => (
    <div class="cmb-wrap">
      <style>{SHARED_STYLE}</style>
      <label class="cmb-label" for="cmb-disabled">
        Country (disabled)
      </label>
      <Combobox
        class="morphos-combobox"
        options={COUNTRY_OPTIONS}
        defaultValue="br"
        disabled
        placeholder="Disabled combobox"
        id="cmb-disabled"
        aria-label="Disabled country selector"
      />
      <div class="cmb-status">
        data-disabled="" | defaultValue="br" (Brazil)
      </div>
    </div>
  ),
};
