import { StatefulComponent } from "@praxisjs/core";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@morphos/layout";

const FAQ_ITEMS = [
  {
    value: "q1",
    question: "What is a headless component library?",
    answer:
      "A headless component library provides behavior and accessibility without any default styles. You bring your own CSS, giving complete control over visual design while the library handles focus management, keyboard navigation, and ARIA attributes.",
  },
  {
    value: "q2",
    question: "How does the data-* attribute system work?",
    answer:
      "Components expose interactive state as data-* attributes on their root elements — for example data-expanded, data-open, data-disabled. This lets you style components with CSS attribute selectors without class manipulation.",
  },
  {
    value: "q3",
    question: "What is the difference between single and multiple mode?",
    answer:
      "In single mode only one item can be open at a time — opening another automatically closes the current one. In multiple mode any number of items can be open simultaneously.",
  },
  {
    value: "q4",
    question: "Can I make single mode non-collapsible?",
    answer:
      "Yes. When collapsible is false, clicking the open trigger again does nothing — the item stays open until another item is activated. Set collapsible={true} to allow toggling the open item closed.",
  },
];

// ---------- Single story ----------

interface SingleArgs {
  collapsible: boolean;
}

@Component()
class AccordionSingleDemo extends StatefulComponent {
  @Prop() collapsible = true;

  @State() accordion = new Accordion({ type: "single", collapsible: true });

  onBeforeMount() {
    this.accordion = new Accordion({ type: "single", collapsible: this.collapsible });
    this.accordion.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:32px">
        <p style="font-size:13px;color:var(--morphos-color-text-muted);margin:0 0 20px">
          Single mode — only one item open at a time.
          {() => this.accordion.collapsible
            ? " Collapsible: clicking the active trigger closes it."
            : " Non-collapsible: the open item stays open until another is activated."}
        </p>
        <div class="morphos-accordion" style="max-width:560px">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.value} accordion={this.accordion} value={item.value} class="morphos-accordion-item">
              <AccordionTrigger accordion={this.accordion} item={item.value} class="morphos-accordion-trigger">
                {item.question}
              </AccordionTrigger>
              <AccordionContent accordion={this.accordion} item={item.value} class="morphos-accordion-content">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </div>
        <p style="margin:14px 0 0;font-size:12px;font-family:monospace;color:var(--morphos-color-text-muted)">
          type="single" collapsible={"{"}
          {() => String(this.accordion.collapsible)}
          {"}"}
        </p>
      </div>
    );
  }
}

// ---------- Multiple story ----------

@Component()
class AccordionMultipleDemo extends StatefulComponent {
  @State() accordion = new Accordion({ type: "multiple" });

  onBeforeMount() {
    this.accordion.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:32px">
        <p style="font-size:13px;color:var(--morphos-color-text-muted);margin:0 0 20px">
          Multiple mode — any number of items can be open simultaneously.
        </p>
        <div class="morphos-accordion" style="max-width:560px">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.value} accordion={this.accordion} value={item.value} class="morphos-accordion-item">
              <AccordionTrigger accordion={this.accordion} item={item.value} class="morphos-accordion-trigger">
                {item.question}
              </AccordionTrigger>
              <AccordionContent accordion={this.accordion} item={item.value} class="morphos-accordion-content">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </div>
        <p style="margin:14px 0 0;font-size:12px;font-family:monospace;color:var(--morphos-color-text-muted)">
          type="multiple"
        </p>
      </div>
    );
  }
}

// ---------- DefaultOpen story ----------

@Component()
class AccordionDefaultOpenDemo extends StatefulComponent {
  @State() accordion = new Accordion({ type: "single", collapsible: true, defaultValue: "q2" });

  onBeforeMount() {
    this.accordion.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:32px">
        <p style="font-size:13px;color:var(--morphos-color-text-muted);margin:0 0 20px">
          Starts with item 2 open via <code>defaultValue="q2"</code>. Uncontrolled — the
          accordion owns its state after mount.
        </p>
        <div class="morphos-accordion" style="max-width:560px">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.value} accordion={this.accordion} value={item.value} class="morphos-accordion-item">
              <AccordionTrigger accordion={this.accordion} item={item.value} class="morphos-accordion-trigger">
                {item.question}
              </AccordionTrigger>
              <AccordionContent accordion={this.accordion} item={item.value} class="morphos-accordion-content">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </div>
        <p style="margin:14px 0 0;font-size:12px;font-family:monospace;color:var(--morphos-color-text-muted)">
          defaultValue="q2"
        </p>
      </div>
    );
  }
}

// ---------- Meta ----------

const meta: Meta<SingleArgs> = {
  title: "Layout/Accordion",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Vertically stacked sections that expand and collapse. Supports single and multiple selection modes with full keyboard navigation and ARIA attributes. Styled here with the `@morphos/styles` `morphos-accordion` recipe.",
      },
    },
  },
  argTypes: {
    collapsible: {
      control: "boolean",
      description: "Allow the active item to be closed by clicking its trigger again (single mode only).",
    },
  },
  args: {
    collapsible: true,
  },
};

export default meta;

type Story = StoryObj<SingleArgs>;

export const Single: Story = {
  name: "Single — FAQ",
  render: (args) => <AccordionSingleDemo collapsible={args.collapsible} />,
};

export const Multiple: Story = {
  name: "Multiple — all items independent",
  render: () => <AccordionMultipleDemo />,
};

export const DefaultOpen: Story = {
  name: "Default Open — starts with item 2 expanded",
  render: () => <AccordionDefaultOpenDemo />,
};
