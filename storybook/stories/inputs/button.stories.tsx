import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Button } from "@morphos/inputs";

const meta: Meta = {
  title: "Inputs/Button",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Headless button primitive. Renders a `<button>` or `<a>` depending on the `as` prop. Sets `data-disabled` for CSS styling without class manipulation. Styled here with the `@morphos/styles` `morphos-button` recipe.",
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    label: "Click me",
    disabled: false,
  },
};
export default meta;

type Story = StoryObj<{ label: string; disabled: boolean }>;

export const Default: Story = {
  name: "Default",
  render: (args) => (
    <div style="font-family:sans-serif;padding:24px">
      <Button disabled={args.disabled} class="morphos-button">
        {args.label}
      </Button>
      <p style="margin:12px 0 0;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
        data-disabled={args.disabled ? '""' : "undefined"}
      </p>
    </div>
  ),
};

export const AsLink: Story = {
  name: "As Link",
  render: () => (
    <div style="font-family:sans-serif;padding:24px">
      <Button as="a" href="#" class="morphos-button morphos-button--ghost">
        Link button
      </Button>
      <p style="margin:12px 0 0;font-size:.75rem;color:var(--morphos-color-text-muted)">
        Rendered as <code>&lt;a&gt;</code> via <code>as="a"</code>. Sets{" "}
        <code>aria-disabled</code> instead of the HTML <code>disabled</code>{" "}
        attribute.
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => (
    <div style="font-family:sans-serif;padding:24px">
      <Button disabled class="morphos-button">
        Disabled
      </Button>
      <p style="margin:12px 0 0;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace">
        data-disabled=""
      </p>
    </div>
  ),
};

@Component()
class ClickCounterDemo extends StatefulComponent {
  @State() count = 0;

  onBeforeMount() {
    this.count = 0;
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px">
        <p style="margin:0 0 12px;font-size:.875rem;color:var(--morphos-color-text)">
          Clicked <strong>{() => this.count}</strong>{" "}
          {() => (this.count === 1 ? "time" : "times")}
        </p>
        <Button
          class="morphos-button"
          onClick={() => {
            this.count++;
          }}
        >
          Click me
        </Button>
        <button
          class="morphos-button morphos-button--outline"
          style="margin-left:8px"
          onClick={() => {
            this.count = 0;
          }}
        >
          Reset
        </button>
      </div>
    );
  }
}

export const WithClickCounter: Story = {
  name: "With Click Counter",
  render: () => <ClickCounterDemo />,
};
