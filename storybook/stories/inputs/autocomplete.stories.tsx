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
      <div style="font-family:sans-serif;padding:24px;max-width:360px">
        <label style="display:block;font-size:.875rem;font-weight:500;color:var(--morphos-color-text);margin-bottom:6px" for="ac-default">
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
        <div style="font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace;background:var(--morphos-color-bg-subtle);padding:5px 10px;border-radius:4px;margin-top:8px">
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
      <div style="font-family:sans-serif;padding:24px;max-width:360px">
        <label style="display:block;font-size:.875rem;font-weight:500;color:var(--morphos-color-text);margin-bottom:6px" for="ac-tech">
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
        <div style="font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace;background:var(--morphos-color-bg-subtle);padding:5px 10px;border-radius:4px;margin-top:8px">
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
    <div style="font-family:sans-serif;padding:24px;max-width:360px">
      <label style="display:block;font-size:.875rem;font-weight:500;color:var(--morphos-color-text);margin-bottom:6px" for="ac-disabled">
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
      <div style="font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace;background:var(--morphos-color-bg-subtle);padding:5px 10px;border-radius:4px;margin-top:8px">
        data-disabled="" | defaultValue="Berlin"
      </div>
    </div>
  ),
};

export const WithDefaultValue: Story = {
  name: "With Default Value",
  render: () => (
    <div style="font-family:sans-serif;padding:24px;max-width:360px">
      <label style="display:block;font-size:.875rem;font-weight:500;color:var(--morphos-color-text);margin-bottom:6px" for="ac-prefilled">
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
      <div style="font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace;background:var(--morphos-color-bg-subtle);padding:5px 10px;border-radius:4px;margin-top:8px">
        defaultValue="Tokyo" | free-text editing allowed
      </div>
    </div>
  ),
};
