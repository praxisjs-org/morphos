import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Autocomplete } from "@morphos/inputs";

const CITY_SUGGESTIONS = [
  { value: "new-york", label: "New York" },
  { value: "london", label: "London" },
  { value: "paris", label: "Paris" },
  { value: "tokyo", label: "Tokyo" },
  { value: "sydney", label: "Sydney" },
  { value: "berlin", label: "Berlin" },
];

const TECH_SUGGESTIONS = [
  { value: "React", label: "React" },
  { value: "Vue", label: "Vue.js" },
  { value: "Angular", label: "Angular" },
  { value: "Svelte", label: "Svelte" },
  { value: "SolidJS", label: "SolidJS" },
  { value: "PraxisJS", label: "PraxisJS" },
  { value: "Qwik", label: "Qwik" },
  { value: "Lit", label: "Lit" },
];

const SHARED_STYLE = `
  .ac-wrap { font-family:sans-serif; padding:24px; max-width:360px; }
  .ac-label { display:block; font-size:.875rem; font-weight:500; color:#374151; margin-bottom:6px; }
  .ac-status { font-size:.75rem; color:#6b7280; font-family:monospace; background:#f9fafb; padding:5px 10px; border-radius:4px; margin-top:8px; }
`;

const meta: Meta = {
  title: "Inputs/Autocomplete",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Free-text input with a filterable suggestion list. Supports keyboard navigation (arrows, Enter, Escape), controlled and uncontrolled value, a custom `filterFn`, and `data-open` / `data-disabled` for CSS. Styled here with the `@morphos/styles` `morphos-autocomplete` recipe.",
      },
    },
  },
};
export default meta;

type Story = StoryObj;

@Component()
class DefaultAutocompleteDemo extends StatefulComponent {
  @State() selected: string | undefined = undefined;

  onBeforeMount() {
    this.selected = undefined;
  }

  render() {
    return (
      <div class="ac-wrap">
        <style>{SHARED_STYLE}</style>
        <label class="ac-label" for="ac-default">
          Departure city
        </label>
        <Autocomplete
          class="morphos-autocomplete"
          suggestions={CITY_SUGGESTIONS}
          placeholder="Type a city name…"
          onSuggestionSelect={(s: { value: string; label?: string }) => {
            this.selected = s.label ?? s.value;
          }}
          onValueChange={(v: string) => { if (!v) this.selected = undefined; }}
          id="ac-default"
          aria-label="City search"
        />
        <div class="ac-status">
          selected: "{() => this.selected ?? "(none)"}"
        </div>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultAutocompleteDemo />,
};

@Component()
class CustomFilterDemo extends StatefulComponent {
  @State() selected: string | undefined = undefined;

  onBeforeMount() {
    this.selected = undefined;
  }

  render() {
    return (
      <div class="ac-wrap">
        <style>{SHARED_STYLE}</style>
        <label class="ac-label" for="ac-tech">
          Framework (starts-with filter)
        </label>
        <Autocomplete
          class="morphos-autocomplete"
          suggestions={TECH_SUGGESTIONS}
          placeholder="Type a framework prefix…"
          filterFn={(s: { value: string; label?: string }, q: string) =>
            (s.label ?? s.value).toLowerCase().startsWith(q.toLowerCase())
          }
          onSuggestionSelect={(s: { value: string; label?: string }) => {
            this.selected = s.label ?? s.value;
          }}
          onValueChange={(v: string) => { if (!v) this.selected = undefined; }}
          id="ac-tech"
          aria-label="Framework autocomplete"
        />
        <div class="ac-status">
          filterFn: startsWith | selected: "{() => this.selected ?? "(none)"}"
        </div>
      </div>
    );
  }
}

export const CustomFilter: Story = {
  name: "Custom Filter",
  render: () => <CustomFilterDemo />,
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => (
    <div class="ac-wrap">
      <style>{SHARED_STYLE}</style>
      <label class="ac-label" for="ac-disabled">
        City (disabled)
      </label>
      <Autocomplete
        class="morphos-autocomplete"
        suggestions={CITY_SUGGESTIONS}
        defaultValue="Berlin"
        disabled
        placeholder="Disabled autocomplete"
        id="ac-disabled"
        aria-label="Disabled city search"
      />
      <div class="ac-status">
        data-disabled="" | defaultValue="Berlin"
      </div>
    </div>
  ),
};

export const WithDefaultValue: Story = {
  name: "With Default Value",
  render: () => (
    <div class="ac-wrap">
      <style>{SHARED_STYLE}</style>
      <label class="ac-label" for="ac-prefilled">
        City (pre-filled)
      </label>
      <Autocomplete
        class="morphos-autocomplete"
        suggestions={CITY_SUGGESTIONS}
        defaultValue="Tokyo"
        placeholder="Type to filter…"
        id="ac-prefilled"
        aria-label="Pre-filled city search"
      />
      <div class="ac-status">
        defaultValue="Tokyo" | free-text editing allowed
      </div>
    </div>
  ),
};
