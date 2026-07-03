import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";

import { generateId, Keys } from "@morphos/core";

import type {
  NavigationMenuContentProps,
  NavigationMenuItemProps,
  NavigationMenuLinkProps,
  NavigationMenuListProps,
  NavigationMenuProps,
  NavigationMenuTriggerProps,
} from "./navigation-menu.types";

@Component()
export class NavigationMenu extends StatefulComponent {
  @Prop() orientation: NavigationMenuProps["orientation"] = "horizontal";
  @Prop() "aria-label"?: string;
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: NavigationMenuProps["children"];

  @State() _activeItem: string | null = null;

  onBeforeMount() {
    this._activeItem = null;
  }

  get activeItem(): string | null {
    return this._activeItem;
  }

  open(item: string) {
    this._activeItem = item;
  }

  close() {
    this._activeItem = null;
  }

  toggle(item: string) {
    if (this._activeItem === item) {
      this.close();
    } else {
      this.open(item);
    }
  }

  render() {
    return (
      <nav
        id={this.id}
        class={this.class}
        aria-label={this["aria-label"]}
        data-orientation={() => this.orientation}
      >
        {this.children}
      </nav>
    );
  }
}

@Component()
export class NavigationMenuList extends StatelessComponent<NavigationMenuListProps> {
  render() {
    const { nav, children, class: cls, id } = this.props;

    return (
      <ul
        id={id}
        class={cls}
        role="list"
        aria-orientation={() => (nav.orientation === "vertical" ? ("vertical" as const) : ("horizontal" as const))}
      >
        {children}
      </ul>
    );
  }
}

@Component()
export class NavigationMenuItem extends StatefulComponent {
  @Prop() nav!: NavigationMenu;
  @Prop() value!: string;
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: NavigationMenuItemProps["children"];

  readonly triggerId = generateId("nav-trigger");
  readonly contentId = generateId("nav-content");

  /** @internal — the registered trigger element; read by `NavigationMenuContent` to exclude it from outside-click detection. */
  _triggerEl: HTMLElement | null = null;

  get isOpen(): boolean {
    return this.nav.activeItem === this.value;
  }

  /** @internal — called by NavigationMenuTrigger on mount. */
  _registerTrigger(el: HTMLElement | null) {
    this._triggerEl = el;
  }

  render() {
    return (
      <li
        id={this.id}
        class={this.class}
        data-active={() => (this.isOpen ? "" : undefined)}
      >
        {this.children}
      </li>
    );
  }
}

@Component()
export class NavigationMenuTrigger extends StatefulComponent {
  @Prop() item!: NavigationMenuItem;
  @Prop() children?: NavigationMenuTriggerProps["children"];
  @Prop() class?: string;
  @Prop() id?: string;

  @Ref<HTMLButtonElement>()
  triggerRef!: RefType<HTMLButtonElement>;

  onMount() {
    this.item._registerTrigger(this.triggerRef.current);
  }

  render() {
    return (
      <button
        ref={this.triggerRef}
        id={this.id ?? this.item.triggerId}
        type="button"
        class={this.class}
        aria-expanded={() => (this.item.isOpen ? "true" : "false")}
        aria-controls={this.item.contentId}
        onClick={() => { this.item.nav.toggle(this.item.value); }}
      >
        {this.children}
      </button>
    );
  }
}

@Component()
export class NavigationMenuContent extends StatefulComponent {
  @Prop() item!: NavigationMenuItem;
  @Prop() children?: NavigationMenuContentProps["children"];
  @Prop() class?: string;
  @Prop() id?: string;

  @Ref<HTMLElement>()
  contentRef!: RefType<HTMLElement>;

  private readonly _handleDocumentMouseDown = (e: MouseEvent) => {
    if (!this.item.isOpen) return;
    if (
      e.target instanceof Node &&
      (this.item._triggerEl?.contains(e.target) === true || this.contentRef.current?.contains(e.target) === true)
    ) return;
    this.item.nav.close();
  };

  private readonly _handleDocumentKeyDown = (e: KeyboardEvent) => {
    if (!this.item.isOpen) return;
    if (e.key === Keys.Escape) {
      this.item.nav.close();
    }
  };

  onMount() {
    document.addEventListener("mousedown", this._handleDocumentMouseDown);
    document.addEventListener("keydown", this._handleDocumentKeyDown);
  }

  onUnmount() {
    document.removeEventListener("mousedown", this._handleDocumentMouseDown);
    document.removeEventListener("keydown", this._handleDocumentKeyDown);
  }

  render() {
    return (
      <div
        ref={this.contentRef}
        id={this.id ?? this.item.contentId}
        class={this.class}
        hidden={() => !this.item.isOpen}
      >
        {this.children}
      </div>
    );
  }
}

@Component()
export class NavigationMenuLink extends StatelessComponent<NavigationMenuLinkProps> {
  render() {
    const { href, target, rel, onClick, children, class: cls, id } = this.props;

    return (
      <a
        id={id}
        class={cls}
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
}
