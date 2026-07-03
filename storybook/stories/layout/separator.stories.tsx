import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Separator } from "@morphos/layout";

const SHARED_STYLE = `
  .sep-h { margin: 16px 0; }
  .sep-v { align-self: stretch; margin: 0 12px; }
  .sep-v-sm { height: 12px; margin: 0 8px; }
  .card {
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 20px;
    background: #fff;
    font-family: sans-serif;
    max-width: 440px;
  }
  .card-title {
    font-size: 15px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 4px;
  }
  .card-sub {
    font-size: 13px;
    color: #6b7280;
    margin: 0;
  }
  .demo-label {
    font-size: 11px;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 14px;
    font-family: sans-serif;
  }
`;

interface HorizontalArgs {
  orientation: "horizontal" | "vertical";
  decorative: boolean;
}

const meta: Meta<HorizontalArgs> = {
  title: "Layout/Separator",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A semantic or decorative dividing line. Renders with role=\"separator\" by default; pass decorative to render aria-hidden for purely visual dividers. Styled here with the `@morphos/styles` `morphos-separator` recipe.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description: "Direction of the separator line.",
    },
    decorative: {
      control: "boolean",
      description: "When true, renders aria-hidden for purely visual separators.",
    },
  },
  args: {
    orientation: "horizontal",
    decorative: false,
  },
};

export default meta;

type Story = StoryObj<HorizontalArgs>;

export const Horizontal: Story = {
  name: "Horizontal — between content blocks",
  render: (args) => (
    <div style="font-family:sans-serif;padding:32px">
      <style>{SHARED_STYLE}</style>
      <p class="demo-label">Horizontal separator</p>
      <div class="card">
        <p class="card-title">Account settings</p>
        <p class="card-sub">Manage your profile and preferences</p>
        <Separator
          orientation={args.orientation}
          decorative={args.decorative}
          class="morphos-separator sep-h"
        />
        <div style="font-size:13px;color:#374151;margin-bottom:8px">
          Display name: <strong>User Name</strong>
        </div>
        <div style="font-size:13px;color:#374151;margin-bottom:8px">
          Email: <strong>you@example.com</strong>
        </div>
        <Separator
          orientation={args.orientation}
          decorative={args.decorative}
          class="morphos-separator sep-h"
        />
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:13px;color:#374151">Plan:</span>
          <span style="padding:2px 8px;background:#ede9fe;color:#6d5bbd;border-radius:4px;font-size:12px;font-weight:500">
            Pro
          </span>
        </div>
      </div>
      <p style="margin:14px 0 0;font-size:12px;font-family:monospace;color:#9ca3af">
        orientation="{args.orientation}" decorative={"{"}
        {String(args.decorative)}
        {"}"}
      </p>
    </div>
  ),
};

export const Vertical: Story = {
  name: "Vertical — inline between spans",
  render: () => (
    <div style="font-family:sans-serif;padding:32px">
      <style>{SHARED_STYLE}</style>
      <p class="demo-label">Vertical separator — stat bar</p>
      <div
        style="display:flex;align-items:center;padding:16px 20px;border:1px solid #e5e7eb;border-radius:10px;background:#fff;max-width:400px"
      >
        {[
          { label: "articles", value: "48" },
          { label: "followers", value: "12.4k" },
          { label: "following", value: "230" },
        ].map((stat, i) => (
          <>
            {i > 0 && <Separator orientation="vertical" decorative class="morphos-separator sep-v" />}
            <div key={stat.label} style="text-align:center;padding:0 8px">
              <strong style="display:block;font-size:16px;color:#111827">{stat.value}</strong>
              <span style="font-size:12px;color:#9ca3af">{stat.label}</span>
            </div>
          </>
        ))}
      </div>

      <p class="demo-label" style="margin-top:28px">Vertical separator — breadcrumb</p>
      <div style="display:flex;align-items:center;font-size:13px;color:#9ca3af">
        <a href="#" style="color:#6d5bbd;text-decoration:none">Home</a>
        <Separator orientation="vertical" decorative class="morphos-separator sep-v-sm" />
        <a href="#" style="color:#6d5bbd;text-decoration:none">Docs</a>
        <Separator orientation="vertical" decorative class="morphos-separator sep-v-sm" />
        <span style="color:#374151;font-weight:500">Separator</span>
      </div>
    </div>
  ),
};
