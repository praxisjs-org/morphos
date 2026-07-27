import type { Meta, StoryObj } from "@praxisjs/storybook";
import {
  ArrowRight,
  Check,
  Plus,
  Settings,
  Trash2,
} from "lucide";

import { LucideIcon } from "@morphos/icons";

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

type Args = {
  size: number;
  color: string;
  strokeWidth: number;
  absoluteStrokeWidth: boolean;
};

const meta: Meta<Args> = {
  title: "Icons/LucideIcon",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Renders icon data from the `lucide` package's `[tag, attrs][]` node format: " +
          "`import { Plus } from \"lucide\"` then `<LucideIcon icon={Plus} />`. `@morphos/icons` " +
          "does not depend on `lucide` — bring your own version of the icon set.",
      },
    },
  },
  argTypes: {
    size: { control: { type: "range", min: 12, max: 64, step: 4 } },
    color: { control: { type: "color" } },
    strokeWidth: { control: { type: "range", min: 0.5, max: 4, step: 0.5 } },
    absoluteStrokeWidth: { control: "boolean" },
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
    color: "#0ea5e9",
    strokeWidth: 2,
    absoluteStrokeWidth: false,
  },
  render: (args) => (
    <div style="font-family:sans-serif;display:flex;align-items:center;gap:16px;padding:24px">
      <LucideIcon
        icon={Plus}
        size={args.size}
        color={args.color}
        strokeWidth={args.strokeWidth}
        absoluteStrokeWidth={args.absoluteStrokeWidth}
        aria-label="Add item"
      />
      <span style="font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
        {"size=" + String(args.size) + " · strokeWidth=" + String(args.strokeWidth)}
      </span>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Gallery — a handful of icons from the lucide package
// ---------------------------------------------------------------------------

const GALLERY = [
  { icon: Plus, label: "Plus" },
  { icon: Check, label: "Check" },
  { icon: ArrowRight, label: "ArrowRight" },
  { icon: Settings, label: "Settings" },
  { icon: Trash2, label: "Trash2" },
];

export const Gallery: StoryObj = {
  name: "Gallery",
  render: () => (
    <div style="font-family:sans-serif;display:flex;gap:24px;padding:24px">
      {GALLERY.map((item) => (
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
          <LucideIcon icon={item.icon} size={28} aria-label={item.label} />
          <span style="font-size:.6875rem;color:var(--morphos-color-text-muted);font-family:monospace">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  ),
};

// ---------------------------------------------------------------------------
// AbsoluteStrokeWidth — stroke thickness stays constant across sizes
// ---------------------------------------------------------------------------

export const AbsoluteStrokeWidthComparison: StoryObj = {
  name: "absoluteStrokeWidth comparison",
  render: () => (
    <div style="font-family:sans-serif;padding:24px">
      <div style="display:flex;align-items:flex-end;gap:24px;margin-bottom:20px">
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
          <LucideIcon icon={Check} size={16} strokeWidth={2} />
          <LucideIcon icon={Check} size={32} strokeWidth={2} />
          <LucideIcon icon={Check} size={48} strokeWidth={2} />
          <span style="font-size:.6875rem;color:var(--morphos-color-text-muted);font-family:monospace">default</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
          <LucideIcon icon={Check} size={16} strokeWidth={2} absoluteStrokeWidth />
          <LucideIcon icon={Check} size={32} strokeWidth={2} absoluteStrokeWidth />
          <LucideIcon icon={Check} size={48} strokeWidth={2} absoluteStrokeWidth />
          <span style="font-size:.6875rem;color:var(--morphos-color-text-muted);font-family:monospace">absoluteStrokeWidth</span>
        </div>
      </div>
      <p style="margin:0;font-size:.75rem;font-family:monospace;color:var(--morphos-color-text-muted);max-width:420px">
        Without it, the stroke looks proportionally heavier as the icon shrinks. With it, the
        rendered stroke thickness stays visually constant.
      </p>
    </div>
  ),
};
