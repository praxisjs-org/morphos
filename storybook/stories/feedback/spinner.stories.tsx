import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Spinner } from "@morphos/feedback";

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

type Args = {
  label: string;
};

const meta: Meta<Args> = {
  title: "Feedback/Spinner",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Headless loading indicator. Renders a `role=\"status\"` element with `aria-busy=\"true\"` " +
          "and `aria-live=\"polite\"`. All visual animation is applied via CSS — Morphos ships zero built-in styles. Styled here with the `@morphos/styles` `morphos-spinner` recipe.",
      },
    },
  },
  argTypes: {
    label: {
      control: { type: "text" },
      description: "Accessible label passed as `aria-label` — announced by screen readers.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

// ---------------------------------------------------------------------------
// Default — args-driven
// ---------------------------------------------------------------------------

export const Default: Story = {
  name: "Default",
  args: {
    label: "Loading",
  },
  render: (args) => (
    <div style="font-family:sans-serif;padding:24px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <Spinner class="morphos-spinner" aria-label={args.label} />
        <span style="font-size:.875rem;color:var(--morphos-color-text-muted);font-family:sans-serif">{args.label + "..."}</span>
      </div>
      <p style="margin:0;font-size:.75rem;font-family:monospace;color:var(--morphos-color-text-muted)">
        {"aria-label=\"" + args.label + "\" · role=\"status\" · aria-busy=\"true\" · aria-live=\"polite\""}
      </p>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Inline — spinner inline next to text
// ---------------------------------------------------------------------------

@Component()
class InlineDemo extends StatelessComponent {
  render() {
    return (
      <div style="font-family:sans-serif;max-width:320px">
        <div style="display:inline-flex;align-items:center;gap:8px;font-size:.875rem;color:var(--morphos-color-text)">
          <Spinner class="morphos-spinner" aria-label="Saving" />
          <span>Saving changes…</span>
        </div>

        <div style="display:inline-flex;align-items:center;gap:8px;font-size:.875rem;color:var(--morphos-color-text);margin-top:12px">
          <Spinner class="morphos-spinner" aria-label="Syncing" />
          <span>Syncing with server…</span>
        </div>

        <div style="display:inline-flex;align-items:center;gap:8px;font-size:.875rem;color:var(--morphos-color-text);margin-top:12px">
          <Spinner class="morphos-spinner" aria-label="Uploading" />
          <span>Uploading file (2 of 5)…</span>
        </div>
      </div>
    );
  }
}

export const Inline: StoryObj = {
  name: "Inline",
  render: () => <InlineDemo />,
};
