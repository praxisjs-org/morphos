import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Emit, Prop, Ref, State, type Ref as RefType  } from "@praxisjs/decorators";
import { Portal } from "@praxisjs/runtime";

import {
  computeAnchorPosition,
  generateId,
  Keys,
  wrapIndex,
  type AnchorAlign,
  type AnchorPosition,
  type AnchorSide,
} from "@morphos/core";

import type {
  DropdownItemProps,
  DropdownMenuProps,
  DropdownProps,
  DropdownTriggerProps,
} from "./dropdown.types";

@Component()
export class Dropdown extends StatefulComponent {
  @Prop() open?: boolean;
  @Prop() defaultOpen = false;
  @Prop() onOpenChange?: DropdownProps["onOpenChange"];
  @Prop() closeOnSelect = true;
  @Prop() side: AnchorSide = "bottom";
  @Prop() align: AnchorAlign = "start";
  @Prop() sideOffset = 4;
  @Prop() children?: DropdownProps["children"];

  @State() _open = false;
  @State() _activeIndex = -1;
  @State() _position: AnchorPosition | null = null;

  readonly menuId = generateId("dropdown-menu");
  readonly triggerId = generateId("dropdown-trigger");

  /** Registered menu items — populated by DropdownItem on mount. */
  readonly _items: HTMLElement[] = [];

  /** Trigger element — registered by DropdownTrigger on mount, used to compute the menu's position. */
  private _triggerEl: HTMLElement | null = null;

  onBeforeMount() {
    this._open = this.defaultOpen;
    this._activeIndex = -1;
    this._position = null;
  }

  get isOpen(): boolean {
    return this.open ?? this._open;
  }

  /** @internal — called by DropdownTrigger on mount. */
  _registerTrigger(el: HTMLElement | null) {
    this._triggerEl = el;
  }

  private _updatePosition() {
    if (this._triggerEl) {
      this._position = computeAnchorPosition(this._triggerEl, {
        side: this.side,
        align: this.align,
        offset: this.sideOffset,
      });
    }
  }

  @Emit("onOpenChange")
  openDropdown() {
    if (this.open === undefined) this._open = true;
    this._activeIndex = 0;
    this._updatePosition();
    return true;
  }

  @Emit("onOpenChange")
  closeDropdown() {
    if (this.open === undefined) this._open = false;
    this._activeIndex = -1;
    return false;
  }

  toggle() {
    if (this.isOpen) this.closeDropdown(); else this.openDropdown();
  }

  handleKeyDown(event: KeyboardEvent) {
    if (!this.isOpen) return;

    if (event.key === Keys.ArrowDown) {
      event.preventDefault();
      this._activeIndex = wrapIndex(this._activeIndex + 1, this._items.length);
      this._items[this._activeIndex]?.focus();
    } else if (event.key === Keys.ArrowUp) {
      event.preventDefault();
      this._activeIndex = wrapIndex(this._activeIndex - 1, this._items.length);
      this._items[this._activeIndex]?.focus();
    } else if (event.key === Keys.Home) {
      event.preventDefault();
      this._activeIndex = 0;
      this._items[0]?.focus();
    } else if (event.key === Keys.End) {
      event.preventDefault();
      this._activeIndex = this._items.length - 1;
      this._items[this._activeIndex]?.focus();
    } else if (event.key === Keys.Escape || event.key === Keys.Tab) {
      this.closeDropdown();
    }
  }

  render() {
    return <>{this.children}</>;
  }
}

@Component()
export class DropdownTrigger extends StatefulComponent {
  @Prop() dropdown!: Dropdown;
  @Prop() children?: DropdownTriggerProps["children"];
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() "aria-label"?: string;

  @Ref<HTMLButtonElement>()
  triggerRef!: RefType<HTMLButtonElement>;

  onMount() {
    this.dropdown._registerTrigger(this.triggerRef.current);
  }

  render() {
    return (
      <button
        ref={this.triggerRef}
        id={this.id ?? this.dropdown.triggerId}
        type="button"
        class={this.class}
        aria-haspopup={"menu" as const}
        aria-expanded={() => (this.dropdown.isOpen ? "true" : "false")}
        aria-controls={this.dropdown.menuId}
        aria-label={this["aria-label"]}
        data-open={() => (this.dropdown.isOpen ? "" : undefined)}
        onClick={() => { this.dropdown.toggle(); }}
      >
        {this.children}
      </button>
    );
  }
}

@Component()
export class DropdownMenu extends StatelessComponent<DropdownMenuProps> {
  render() {
    const {
      dropdown,
      children,
      class: cls,
      id,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
    } = this.props;

    return (
      <div style={{ display: "contents" }}>
        {() =>
          dropdown.isOpen && (
            <Portal>
              <div
                style={() => ({
                  position: "fixed",
                  top: `${String(dropdown._position?.top ?? 0)}px`,
                  left: `${String(dropdown._position?.left ?? 0)}px`,
                  transform: dropdown._position?.transform ?? "none",
                })}
              >
                <ul
                  id={id ?? dropdown.menuId}
                  role="menu"
                  class={cls}
                  aria-label={ariaLabel}
                  aria-labelledby={ariaLabelledby ?? dropdown.triggerId}
                  data-open=""
                  onKeyDown={(e: KeyboardEvent) => { dropdown.handleKeyDown(e); }}
                >
                  {children}
                </ul>
              </div>
            </Portal>
          )
        }
      </div>
    );
  }
}

@Component()
export class DropdownItem extends StatefulComponent {
  @Prop() dropdown!: Dropdown;
  @Prop() value!: string;
  @Prop() label?: string;
  @Prop() disabled = false;
  @Prop() onSelect?: DropdownItemProps["onSelect"];
  @Prop() children?: DropdownItemProps["children"];
  @Prop() class?: string;
  @Prop() id?: string;

  @Ref<HTMLLIElement>()
  itemRef!: RefType<HTMLLIElement>;

  onMount() {
    if (this.itemRef.current) {
      this.dropdown._items.push(this.itemRef.current);
    }
  }

  onUnmount() {
    const el = this.itemRef.current;
    if (el) {
      const idx = this.dropdown._items.indexOf(el);
      if (idx >= 0) this.dropdown._items.splice(idx, 1);
    }
  }

  private readonly _handleSelect = () => {
    if (this.disabled) return;
    this.onSelect?.();
    if (this.dropdown.closeOnSelect) {
      this.dropdown.closeDropdown();
    }
  };

  render() {
    return (
      <li
        id={this.id}
        ref={this.itemRef}
        role="menuitem"
        class={this.class}
        tabIndex={this.disabled ? -1 : 0}
        aria-disabled={this.disabled ? ("true" as const) : undefined}
        data-disabled={this.disabled ? "" : undefined}
        onClick={this._handleSelect}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.key === Keys.Enter || e.key === Keys.Space) {
            e.preventDefault();
            this._handleSelect();
          }
        }}
      >
        {this.children ?? this.label}
      </li>
    );
  }
}
