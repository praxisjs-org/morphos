import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Icon } from "@morphos/icons";

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

type Args = {
  size: number;
  color: string;
};

const STAR_PATH = '<path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8L5.7 21l1.7-7-5.4-4.7 7.1-.6z"/>';

const meta: Meta<Args> = {
  title: "Icons/Icon",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Generic, framework-agnostic SVG icon primitive. Renders any raw markup — a full " +
          "`<svg>` string or bare inner markup — sized and colored via props. It's the shared " +
          "rendering foundation behind `LucideIcon` and `PhosphorIcon`, and the escape hatch for " +
          "any other icon set.",
      },
    },
  },
  argTypes: {
    size: { control: { type: "range", min: 12, max: 96, step: 4 } },
    color: { control: { type: "color" } },
  },
};
export default meta;

type Story = StoryObj<Args>;

// ---------------------------------------------------------------------------
// Default — bare inner markup, args-driven
// ---------------------------------------------------------------------------

export const Default: Story = {
  name: "Default",
  args: {
    size: 32,
    color: "#f59e0b",
  },
  render: (args) => (
    <div style="font-family:sans-serif;display:flex;align-items:center;gap:16px;padding:24px">
      <Icon svg={STAR_PATH} size={args.size} color={args.color} aria-label="Favorite" />
      <span style="font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
        {"size=" + String(args.size) + " · color=" + args.color}
      </span>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// FullSvgString — auto-extracts viewBox from a full <svg> string
// ---------------------------------------------------------------------------

const FULL_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">' +
  '<path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/>' +
  "</svg>";

export const FullSvgString: StoryObj = {
  name: "Full <svg> string",
  render: () => (
    <div style="font-family:sans-serif;padding:24px">
      <Icon svg={FULL_SVG} size={40} aria-label="Add" />
      <p style="margin:12px 0 0;font-size:.75rem;font-family:monospace;color:var(--morphos-color-text-muted);max-width:360px">
        The outer &lt;svg&gt; tag and its viewBox="0 0 256 256" are read and stripped
        automatically — pass a Phosphor asset string straight through.
      </p>
    </div>
  ),
};
