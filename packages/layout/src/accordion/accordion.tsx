import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Emit, Prop, State } from "@praxisjs/decorators";

import { generateId, isActivationKey } from "@morphos/core";

import type {
  AccordionContentProps,
  AccordionItemProps,
  AccordionProps,
  AccordionTriggerProps,
} from "./accordion.types";

@Component()
export class Accordion extends StatefulComponent {
  @Prop() type: AccordionProps["type"] = "single";
  @Prop() value?: string | string[];
  @Prop() defaultValue?: string | string[];
  @Prop() onValueChange?: AccordionProps["onValueChange"];
  @Prop() collapsible = true;
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: AccordionProps["children"];

  @State() _value: string | string[] | undefined = undefined;

  onBeforeMount() {
    this._value = this.defaultValue;
  }

  private get _current(): string | string[] | undefined {
    return this.value ?? this._value;
  }

  isOpen(item: string): boolean {
    const current = this._current;
    if (current === undefined) return false;
    return Array.isArray(current) ? current.includes(item) : current === item;
  }

  toggle(item: string) {
    if (this.type === "single") {
      const isCurrentlyOpen = this.isOpen(item);
      const next = isCurrentlyOpen && this.collapsible ? undefined : item;
      this._apply(next);
    } else {
      const current = (this._current as string[] | undefined) ?? [];
      const isCurrentlyOpen = current.includes(item);
      const next = isCurrentlyOpen
        ? current.filter((v) => v !== item)
        : [...current, item];
      this._apply(next);
    }
  }

  private _apply(next: string | string[] | undefined) {
    if (this.value === undefined) {
      this._value = next;
    }
    if (next !== undefined) {
      this._emitValueChange(next);
    }
  }

  @Emit("onValueChange")
  private _emitValueChange(value: string | string[]) {
    return value;
  }

  render() {
    return (
      <div id={this.id} class={this.class} data-type={this.type}>
        {this.children}
      </div>
    );
  }
}

@Component()
export class AccordionItem extends StatelessComponent<AccordionItemProps> {
  render() {
    const { accordion, value, disabled, children, class: cls, id } = this.props;
    return (
      <div
        id={id}
        class={cls}
        data-expanded={() => (accordion.isOpen(value) ? "" : undefined)}
        data-disabled={disabled ? "" : undefined}
      >
        {children}
      </div>
    );
  }
}

@Component()
export class AccordionTrigger extends StatefulComponent {
  @Prop() accordion!: Accordion;
  @Prop() item!: string;
  @Prop() children?: AccordionTriggerProps["children"];
  @Prop() class?: string;
  @Prop() id?: string;

  private readonly _triggerId = generateId("accordion-trigger");
  private readonly _contentId = generateId("accordion-content");

  get contentId(): string {
    return this._contentId;
  }

  render() {
    return (
      <button
        id={this.id ?? this._triggerId}
        type="button"
        class={this.class}
        aria-expanded={() => (this.accordion.isOpen(this.item) ? "true" : "false")}
        aria-controls={this._contentId}
        data-expanded={() => (this.accordion.isOpen(this.item) ? "" : undefined)}
        onClick={() => { this.accordion.toggle(this.item); }}
        onKeyDown={(e: KeyboardEvent) => {
          if (isActivationKey(e)) {
            e.preventDefault();
            this.accordion.toggle(this.item);
          }
        }}
      >
        {this.children}
      </button>
    );
  }
}

@Component()
export class AccordionContent extends StatelessComponent<AccordionContentProps> {
  render() {
    const { accordion, item, children, class: cls, id } = this.props;
    return (
      <div
        id={id}
        role="region"
        class={cls}
        hidden={() => !accordion.isOpen(item)}
        data-expanded={() => (accordion.isOpen(item) ? "" : undefined)}
      >
        {children}
      </div>
    );
  }
}
