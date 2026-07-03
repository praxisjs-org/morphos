import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Progress, Spinner } from "@morphos/feedback";

// ---------------------------------------------------------------------------
// Shared style block
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: "Feedback/Progress",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Headless progress bar and spinner primitives. `Progress` renders `role=\"progressbar\"` with " +
          "`--progress` CSS custom property tracking completion. Omit `value` for an indeterminate state " +
          "(`data-indeterminate` is set). `Spinner` renders `role=\"status\"` with `aria-busy=\"true\"`. Styled here with the `@morphos/styles` `morphos-progress`/`morphos-spinner` recipes.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

// ---------------------------------------------------------------------------
// Determinate — args-driven range slider
// ---------------------------------------------------------------------------

type DeterminateArgs = { value: number };

export const Determinate: StoryObj<DeterminateArgs> = {
  name: "Determinate",
  args: { value: 65 },
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Current progress value (0–100).",
    },
  },
  render: (args) => (
    <div style="font-family:sans-serif;max-width:360px">
      <p style="margin:0 0 6px;font-size:.875rem;color:#374151">
        Upload progress: {args.value}%
      </p>
      <Progress class="morphos-progress" value={args.value} aria-label="Upload progress" />
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Indeterminate — no value prop, animated track
// ---------------------------------------------------------------------------

@Component()
class IndeterminateDemo extends StatefulComponent {
  render() {
    return (
      <div style="font-family:sans-serif;max-width:360px">
          <p style="margin:0 0 6px;font-size:.875rem;color:#374151">Connecting to server…</p>
        <Progress class="morphos-progress" aria-label="Connecting" />
        <p style="margin:8px 0 0;font-size:.78rem;color:#9ca3af">
          No <code>value</code> prop — <code>data-indeterminate</code> is set automatically.
        </p>
      </div>
    );
  }
}

export const Indeterminate: Story = {
  name: "Indeterminate",
  render: () => <IndeterminateDemo />,
};

// ---------------------------------------------------------------------------
// Animated — setInterval drives 0 → 100 → 0 loop
// ---------------------------------------------------------------------------

@Component()
class AnimatedDemo extends StatefulComponent {
  @State() progress = 0;
  private _interval?: ReturnType<typeof setInterval>;

  onBeforeMount() {
    this.progress = 0;
  }

  onMount() {
    this._interval = setInterval(() => {
      this.progress = this.progress >= 100 ? 0 : this.progress + 2;
    }, 60);
  }

  onUnmount() {
    clearInterval(this._interval);
  }

  render() {
    return (
      <div style="font-family:sans-serif;max-width:360px">
          <p style="margin:0 0 6px;font-size:.875rem;color:#374151">
          Processing… {() => this.progress}%
        </p>
        <Progress class="morphos-progress" value={() => this.progress} aria-label="Processing" />
        <p style="margin:8px 0 0;font-size:.78rem;color:#9ca3af">
          Driven by <code>setInterval</code> in <code>onMount</code>. Cleared in <code>onUnmount</code>.
        </p>
      </div>
    );
  }
}

export const Animated: Story = {
  name: "Animated",
  render: () => <AnimatedDemo />,
};

// ---------------------------------------------------------------------------
// SpinnerStory — Spinner component, args-driven label
// ---------------------------------------------------------------------------

type SpinnerArgs = { label: string };

export const SpinnerStory: StoryObj<SpinnerArgs> = {
  name: "Spinner",
  args: { label: "Loading" },
  argTypes: {
    label: {
      control: { type: "text" },
      description: "Accessible label read by screen readers (`aria-label`).",
    },
  },
  render: (args) => (
    <div style="font-family:sans-serif;padding:24px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <Spinner class="morphos-spinner" aria-label={args.label} />
        <span style="font-size:.875rem;color:#6b7280">{args.label + "..."}</span>
      </div>
      <p style="margin:0;font-size:.78rem;color:#9ca3af">
        <code>{"aria-label=\"" + args.label + "\""}</code>
        {" · "}<code>role="status"</code>
        {" · "}<code>aria-busy="true"</code>
        {" · "}<code>aria-live="polite"</code>
      </p>
    </div>
  ),
};
