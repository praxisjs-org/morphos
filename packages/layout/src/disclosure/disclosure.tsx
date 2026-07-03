import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Emit, Prop, State } from "@praxisjs/decorators";

import { generateId } from "@morphos/core";

import type {
  DisclosureContentProps,
  DisclosureProps,
  DisclosureTriggerProps,
} from "./disclosure.types";

@Component()
export class Disclosure extends StatefulComponent {
  @Prop() open?: boolean;
  @Prop() defaultOpen = false;
  @Prop() onOpenChange?: DisclosureProps["onOpenChange"];
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: DisclosureProps["children"];

  @State() _open = false;

  readonly contentId = generateId("disclosure-content");

  onBeforeMount() {
    this._open = this.defaultOpen;
  }

  get isOpen(): boolean {
    return this.open ?? this._open;
  }

  @Emit("onOpenChange")
  toggle() {
    const next = !this.isOpen;
    if (this.open === undefined) this._open = next;
    return next;
  }

  render() {
    return (
      <div id={this.id} class={this.class} data-open={() => (this.isOpen ? "" : undefined)}>
        {this.children}
      </div>
    );
  }
}

@Component()
export class DisclosureTrigger extends StatelessComponent<DisclosureTriggerProps> {
  render() {
    const {
      disclosure,
      children,
      class: cls,
      id,
      "aria-label": ariaLabel,
    } = this.props;

    return (
      <button
        id={id}
        type="button"
        class={cls}
        aria-expanded={() => (disclosure.isOpen ? "true" : "false")}
        aria-controls={disclosure.contentId}
        aria-label={ariaLabel}
        data-open={() => (disclosure.isOpen ? "" : undefined)}
        onClick={() => { disclosure.toggle(); }}
      >
        {children}
      </button>
    );
  }
}

@Component()
export class DisclosureContent extends StatelessComponent<DisclosureContentProps> {
  render() {
    const { disclosure, children, class: cls, id } = this.props;
    return (
      <div
        id={id ?? disclosure.contentId}
        class={cls}
        hidden={() => !disclosure.isOpen}
        data-open={() => (disclosure.isOpen ? "" : undefined)}
      >
        {children}
      </div>
    );
  }
}
