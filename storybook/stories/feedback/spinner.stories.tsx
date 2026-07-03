import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Spinner } from "@morphos/feedback";

// ---------------------------------------------------------------------------
// Shared style block
// ---------------------------------------------------------------------------

const SPINNER_STYLE = `
  .spinner-sm {
    width: 16px;
    height: 16px;
    border-width: 2px;
  }
  .spinner-lg {
    width: 40px;
    height: 40px;
    border-width: 4px;
  }
  .spinner-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    font-family: sans-serif;
  }
  .spinner-row span { font-size: .875rem; color: #6b7280 }
`;

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
      <style>{SPINNER_STYLE}</style>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <Spinner class="morphos-spinner" aria-label={args.label} />
        <span style="font-size:.875rem;color:#6b7280;font-family:sans-serif">{args.label + "..."}</span>
      </div>
      <p style="margin:0;font-size:.75rem;font-family:monospace;color:#9ca3af">
        {"aria-label=\"" + args.label + "\" · role=\"status\" · aria-busy=\"true\" · aria-live=\"polite\""}
      </p>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Sizes — small / default / large side by side
// ---------------------------------------------------------------------------

@Component()
class SizesDemo extends StatelessComponent {
  render() {
    return (
      <div style="font-family:sans-serif;max-width:320px">
        <style>{SPINNER_STYLE}</style>

        <div class="spinner-row">
          <Spinner class="morphos-spinner spinner-sm" aria-label="Loading small" />
          <span>Small — 16 px</span>
        </div>
        <div class="spinner-row">
          <Spinner class="morphos-spinner" aria-label="Loading" />
          <span>Default — 24 px</span>
        </div>
        <div class="spinner-row">
          <Spinner class="morphos-spinner spinner-lg" aria-label="Loading large" />
          <span>Large — 40 px</span>
        </div>

        <div style="margin-top:4px;padding:10px 14px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;font-size:.78rem;color:#0369a1">
          Size is controlled by CSS classes (<code>.spinner-sm</code>, <code>.spinner-lg</code>).
          Pass them via the <code>class</code> prop on the <code>Spinner</code> root.
        </div>
      </div>
    );
  }
}

export const Sizes: StoryObj = {
  name: "Sizes",
  render: () => <SizesDemo />,
};

// ---------------------------------------------------------------------------
// Inline — spinner inline next to text
// ---------------------------------------------------------------------------

@Component()
class InlineDemo extends StatelessComponent {
  render() {
    return (
      <div style="font-family:sans-serif;max-width:320px">
        <style>{`
          ${SPINNER_STYLE}
          .inline-row {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: .875rem;
            color: #374151;
          }
        `}</style>

        <div class="inline-row">
          <Spinner class="morphos-spinner spinner-sm" aria-label="Saving" />
          <span>Saving changes…</span>
        </div>

        <div class="inline-row" style="margin-top:12px">
          <Spinner class="morphos-spinner spinner-sm" aria-label="Syncing" />
          <span>Syncing with server…</span>
        </div>

        <div class="inline-row" style="margin-top:12px">
          <Spinner class="morphos-spinner spinner-sm" aria-label="Uploading" />
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
