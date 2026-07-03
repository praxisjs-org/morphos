import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Alert } from "@morphos/feedback";
import type { AlertVariant } from "@morphos/feedback";

// ---------------------------------------------------------------------------
// Shared style block
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

type Args = {
  variant: AlertVariant;
  title: string;
  children: string;
};

const meta: Meta<Args> = {
  title: "Feedback/Alert",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Inline notification primitive. Renders a `role=\"alert\"` element with `aria-live` semantics. " +
          "Visual styles are applied via `data-variant` — the component ships zero built-in CSS. Styled here with the `@morphos/styles` `morphos-alert` recipe.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["info", "success", "warning", "error"] satisfies AlertVariant[],
      description: "Semantic tone of the alert.",
    },
    title: {
      control: { type: "text" },
      description: "Optional bold heading rendered above the body.",
    },
    children: {
      control: { type: "text" },
      description: "Alert body text.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

// ---------------------------------------------------------------------------
// Default — args-driven, controls wired
// ---------------------------------------------------------------------------

export const Default: Story = {
  name: "Default",
  args: {
    variant: "info",
    title: "Note",
    children: "Your session will expire in 10 minutes.",
  },
  render: (args) => (
    <div style="font-family:sans-serif;max-width:480px">
      <Alert class="morphos-alert" variant={args.variant} title={args.title}>
        {args.children}
      </Alert>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// AllVariants — static demo showing all four variants side by side
// ---------------------------------------------------------------------------

@Component()
class AllVariantsDemo extends StatelessComponent {
  render() {
    return (
      <div style="font-family:sans-serif;display:flex;flex-direction:column;gap:12px;max-width:480px">
          <Alert class="morphos-alert" variant="info" title="Info">
          Your session will expire in 10 minutes. Save your work before then.
        </Alert>
        <Alert class="morphos-alert" variant="success" title="Changes saved">
          Your profile has been updated successfully.
        </Alert>
        <Alert class="morphos-alert" variant="warning" title="Subscription expiring">
          Your plan renews on July 15. Update your payment method to avoid interruption.
        </Alert>
        <Alert class="morphos-alert" variant="error" title="Authentication failed">
          Invalid credentials. Please check your email and password and try again.
        </Alert>
      </div>
    );
  }
}

export const AllVariants: Story = {
  name: "All variants",
  render: () => <AllVariantsDemo />,
};

// ---------------------------------------------------------------------------
// NoTitle — body text only, no title prop
// ---------------------------------------------------------------------------

@Component()
class NoTitleDemo extends StatelessComponent {
  render() {
    return (
      <div style="font-family:sans-serif;display:flex;flex-direction:column;gap:12px;max-width:480px">
          <Alert class="morphos-alert" variant="info">
          Two-factor authentication is enabled on your account.
        </Alert>
        <Alert class="morphos-alert" variant="warning">
          This action cannot be undone. Please review your changes before confirming.
        </Alert>
        <Alert class="morphos-alert" variant="error">
          Your payment method was declined. Please update your billing details.
        </Alert>
      </div>
    );
  }
}

export const NoTitle: Story = {
  name: "No title",
  render: () => <NoTitleDemo />,
};
