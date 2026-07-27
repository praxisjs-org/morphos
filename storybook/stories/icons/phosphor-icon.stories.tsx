import type { Meta, StoryObj } from "@praxisjs/storybook";

import plusBold from "@phosphor-icons/core/assets/bold/plus-bold.svg?raw";
import plusDuotone from "@phosphor-icons/core/assets/duotone/plus-duotone.svg?raw";
import plusFill from "@phosphor-icons/core/assets/fill/plus-fill.svg?raw";
import plusLight from "@phosphor-icons/core/assets/light/plus-light.svg?raw";
import plusRegular from "@phosphor-icons/core/assets/regular/plus.svg?raw";
import plusThin from "@phosphor-icons/core/assets/thin/plus-thin.svg?raw";
import arrowRightRegular from "@phosphor-icons/core/assets/regular/arrow-right.svg?raw";
import gearRegular from "@phosphor-icons/core/assets/regular/gear.svg?raw";
import heartRegular from "@phosphor-icons/core/assets/regular/heart.svg?raw";
import trashRegular from "@phosphor-icons/core/assets/regular/trash.svg?raw";

import { PhosphorIcon } from "@morphos/icons";

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

type Args = {
  size: number;
  color: string;
  mirrored: boolean;
};

const meta: Meta<Args> = {
  title: "Icons/PhosphorIcon",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Renders a raw SVG asset from `@phosphor-icons/core`: import a weight's `.svg` file as " +
          "raw text (Vite: `?raw`) and pass it through. `@morphos/icons` does not depend on " +
          "`@phosphor-icons/core` — bring your own version of the icon set.",
      },
    },
  },
  argTypes: {
    size: { control: { type: "range", min: 12, max: 64, step: 4 } },
    color: { control: { type: "color" } },
    mirrored: { control: "boolean" },
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
    size: 32,
    color: "#a855f7",
    mirrored: false,
  },
  render: (args) => (
    <div style="font-family:sans-serif;display:flex;align-items:center;gap:16px;padding:24px">
      <PhosphorIcon
        svg={plusRegular}
        size={args.size}
        color={args.color}
        mirrored={args.mirrored}
        aria-label="Add item"
      />
      <span style="font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
        {"size=" + String(args.size) + " · mirrored=" + String(args.mirrored)}
      </span>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Weights — pick the weight by choosing which asset you import
// ---------------------------------------------------------------------------

const WEIGHTS = [
  { svg: plusThin, label: "thin" },
  { svg: plusLight, label: "light" },
  { svg: plusRegular, label: "regular" },
  { svg: plusBold, label: "bold" },
  { svg: plusFill, label: "fill" },
  { svg: plusDuotone, label: "duotone" },
];

export const Weights: StoryObj = {
  name: "Weights",
  render: () => (
    <div style="font-family:sans-serif;display:flex;gap:24px;padding:24px">
      {WEIGHTS.map((w) => (
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
          <PhosphorIcon svg={w.svg} size={28} aria-label={"Plus, " + w.label + " weight"} />
          <span style="font-size:.6875rem;color:var(--morphos-color-text-muted);font-family:monospace">
            {w.label}
          </span>
        </div>
      ))}
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Gallery — a handful of icons from @phosphor-icons/core
// ---------------------------------------------------------------------------

const GALLERY = [
  { svg: plusRegular, label: "Plus" },
  { svg: heartRegular, label: "Heart" },
  { svg: arrowRightRegular, label: "ArrowRight" },
  { svg: gearRegular, label: "Gear" },
  { svg: trashRegular, label: "Trash" },
];

export const Gallery: StoryObj = {
  name: "Gallery",
  render: () => (
    <div style="font-family:sans-serif;display:flex;gap:24px;padding:24px">
      {GALLERY.map((item) => (
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
          <PhosphorIcon svg={item.svg} size={28} aria-label={item.label} />
          <span style="font-size:.6875rem;color:var(--morphos-color-text-muted);font-family:monospace">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  ),
};
