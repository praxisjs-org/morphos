import { StatefulComponent } from "@praxisjs/core";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Disclosure, DisclosureContent, DisclosureTrigger } from "@morphos/layout";

// ---------- Default story (args-driven) ----------

interface DefaultArgs {
  defaultOpen: boolean;
}

@Component()
class DisclosureDefaultDemo extends StatefulComponent {
  @Prop() defaultOpen = false;

  @State() disclosure = new Disclosure({ defaultOpen: false });

  onBeforeMount() {
    this.disclosure = new Disclosure({ defaultOpen: this.defaultOpen });
    this.disclosure.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:32px;max-width:520px">
        <p style="font-size:13px;color:#6b7280;margin:0 0 16px">
          Toggle additional details with an accessible button.
          Use the <strong>defaultOpen</strong> control to set the initial state.
        </p>
        <DisclosureTrigger disclosure={this.disclosure} class="morphos-disclosure-trigger">
          What is a headless component?
        </DisclosureTrigger>
        <DisclosureContent disclosure={this.disclosure} class="morphos-disclosure-content">
          A headless component provides behavior and accessibility without any default styles.
          You own the visual design completely — the library handles focus management,
          keyboard interactions, and ARIA attributes.
        </DisclosureContent>
        <p style="margin:14px 0 0;font-size:12px;font-family:monospace;color:#9ca3af">
          defaultOpen={"{"}
          {() => String(this.disclosure.defaultOpen)}
          {"}"}&nbsp; isOpen={"{"}
          {() => String(this.disclosure.isOpen)}
          {"}"}
        </p>
      </div>
    );
  }
}

// ---------- OpenByDefault story ----------

@Component()
class DisclosureOpenByDefaultDemo extends StatefulComponent {
  @State() disclosure = new Disclosure({ defaultOpen: true });

  onBeforeMount() {
    this.disclosure.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:32px;max-width:520px">
        <p style="font-size:13px;color:#6b7280;margin:0 0 16px">
          Starts expanded — useful for primary content that should be visible on load.
        </p>
        <DisclosureTrigger disclosure={this.disclosure} class="morphos-disclosure-trigger">
          Release notes — v2.4.0
        </DisclosureTrigger>
        <DisclosureContent disclosure={this.disclosure} class="morphos-disclosure-content">
          <ul style="margin:0;padding-left:20px;line-height:2">
            <li>New <code>ScrollArea</code> component with hover / always scrollbar modes</li>
            <li>Toolbar now uses roving tabindex for arrow-key navigation</li>
            <li>Separator supports <code>decorative</code> prop for presentational dividers</li>
            <li>All layout components now accept a <code>class</code> prop</li>
          </ul>
        </DisclosureContent>
      </div>
    );
  }
}

// ---------- AsDetails story ----------

@Component()
class DisclosureAsDetailsDemo extends StatefulComponent {
  @State() d1 = new Disclosure();
  @State() d2 = new Disclosure();
  @State() d3 = new Disclosure();

  onBeforeMount() {
    this.d1.onBeforeMount?.();
    this.d2.onBeforeMount?.();
    this.d3.onBeforeMount?.();
  }

  render() {
    const entries = [
      {
        d: this.d1,
        term: "aria-expanded",
        def: 'Set to "true" on the trigger when the content is visible, "false" when hidden. Screen readers announce this state to users.',
      },
      {
        d: this.d2,
        term: "aria-controls",
        def: "Points from the trigger button to the ID of the content region, establishing a programmatic relationship between the two elements.",
      },
      {
        d: this.d3,
        term: "hidden attribute",
        def: 'The content element uses the HTML hidden attribute (not display:none CSS) so that its state is semantically encoded in the DOM and accessible to assistive technology.',
      },
    ];

    return (
      <div style="font-family:sans-serif;padding:32px;max-width:560px">
        <style>{`.details-list { display:flex;flex-direction:column;gap:8px }`}</style>
        <p style="font-size:13px;color:#6b7280;margin:0 0 16px">
          Mimicking an HTML <code>&lt;details&gt;</code> / <code>&lt;summary&gt;</code> pattern
          with full ARIA semantics and keyboard support.
        </p>
        <div class="details-list">
          {entries.map(({ d, term, def }) => (
            <div key={term}>
              <DisclosureTrigger disclosure={d} class="morphos-disclosure-trigger">
                {term}
              </DisclosureTrigger>
              <DisclosureContent disclosure={d} class="morphos-disclosure-content">
                {def}
              </DisclosureContent>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

// ---------- Controlled story ----------

@Component()
class DisclosureControlledDemo extends StatefulComponent {
  @State() open = false;
  @State() changeCount = 0;

  @State() disclosure = new Disclosure({
    onOpenChange: () => { /* handled below */ },
  });

  onBeforeMount() {
    this.open = false;
    this.changeCount = 0;
    this.disclosure = new Disclosure({
      open: (() => this.open) as unknown as boolean,
      onOpenChange: (next: boolean) => {
        this.open = next;
        this.changeCount++;
      },
    });
    this.disclosure.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:32px;max-width:520px">
        <p style="font-size:13px;color:#6b7280;margin:0 0 20px">
          Controlled mode — parent owns the open state via the <code>open</code> prop
          and <code>onOpenChange</code> callback.
        </p>

        <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
          <button
            class={() => `morphos-button ${this.open ? "morphos-button--outline" : ""}`}
            onClick={() => { this.open = false; this.changeCount++; }}
          >
            Close
          </button>
          <button
            class={() => `morphos-button ${this.open ? "" : "morphos-button--outline"}`}
            onClick={() => { this.open = true; this.changeCount++; }}
          >
            Open
          </button>
          <button
            class="morphos-button morphos-button--outline"
            onClick={() => { this.open = !this.open; this.changeCount++; }}
          >
            Toggle
          </button>
        </div>

        <DisclosureTrigger disclosure={this.disclosure} class="morphos-disclosure-trigger">
          Advanced configuration
        </DisclosureTrigger>
        <DisclosureContent disclosure={this.disclosure} class="morphos-disclosure-content">
          In controlled mode, pass <code>open</code> and <code>onOpenChange</code> to the
          Disclosure instance. The trigger still fires <code>onOpenChange</code> — the parent
          decides whether to update its state.
        </DisclosureContent>

        <p style="margin:14px 0 0;font-size:12px;font-family:monospace;color:#9ca3af">
          open={"{"}
          {() => String(this.open)}
          {"}"}&nbsp; changes={"{"}
          {() => String(this.changeCount)}
          {"}"}
        </p>
      </div>
    );
  }
}

// ---------- Meta ----------

const meta: Meta<DefaultArgs> = {
  title: "Layout/Disclosure",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A single expandable section with a trigger button and collapsible content region. Fully accessible with ARIA and keyboard support. Styled here with the `@morphos/styles` `morphos-disclosure` recipe.",
      },
    },
  },
  argTypes: {
    defaultOpen: {
      control: "boolean",
      description: "Whether the content is expanded on initial mount (uncontrolled).",
    },
  },
  args: {
    defaultOpen: false,
  },
};

export default meta;

type Story = StoryObj<DefaultArgs>;

export const Default: Story = {
  name: "Default — toggle reveal",
  render: (args) => <DisclosureDefaultDemo defaultOpen={args.defaultOpen} />,
};

export const OpenByDefault: Story = {
  name: "Open By Default",
  render: () => <DisclosureOpenByDefaultDemo />,
};

export const AsDetails: Story = {
  name: "As Details — glossary pattern",
  render: () => <DisclosureAsDetailsDemo />,
};

export const Controlled: Story = {
  name: "Controlled — external open state",
  render: () => <DisclosureControlledDemo />,
};
