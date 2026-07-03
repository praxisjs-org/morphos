import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Prop, Ref, State, type Ref as RefType  } from "@praxisjs/decorators";
import { Portal } from "@praxisjs/runtime";

import {
  computeAnchorPosition,
  generateId,
  Keys,
  type AnchorAlign,
  type AnchorPosition,
  type AnchorSide,
} from "@morphos/core";

import type {
  MenubarContentProps,
  MenubarItemProps,
  MenubarMenuProps,
  MenubarProps,
  MenubarSeparatorProps,
  MenubarTriggerProps,
} from "./menubar.types";

@Component()
export class Menubar extends StatefulComponent {
  @Prop() "aria-label"?: string;
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: MenubarProps["children"];

  @State() _activeMenu: string | null = null;

  onBeforeMount() {
    this._activeMenu = null;
  }

  get activeMenu(): string | null {
    return this._activeMenu;
  }

  open(id: string) {
    this._activeMenu = id;
  }

  close() {
    this._activeMenu = null;
  }

  toggle(id: string) {
    if (this._activeMenu === id) {
      this.close();
    } else {
      this.open(id);
    }
  }

  render() {
    return (
      <div
        id={this.id}
        class={this.class}
        role="menubar"
        aria-label={this["aria-label"]}
      >
        {this.children}
      </div>
    );
  }
}

@Component()
export class MenubarMenu extends StatefulComponent {
  @Prop() menubar!: Menubar;
  @Prop() value!: string;
  @Prop() side: AnchorSide = "bottom";
  @Prop() align: AnchorAlign = "start";
  @Prop() sideOffset = 4;
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: MenubarMenuProps["children"];

  @State() _position: AnchorPosition | null = null;

  /** @internal — the registered trigger element; read by `MenubarContent` to exclude it from outside-click detection. */
  _triggerEl: HTMLElement | null = null;

  /** @internal — the registered content element; read by `MenubarContent` to exclude it from outside-click detection. */
  _contentEl: HTMLElement | null = null;

  readonly triggerId = generateId("menubar-trigger");
  readonly contentId = generateId("menubar-content");

  onBeforeMount() {
    this._position = null;
  }

  get isOpen(): boolean {
    return this.menubar.activeMenu === this.value;
  }

  /** @internal — called by MenubarTrigger on mount. */
  _registerTrigger(el: HTMLElement | null) {
    this._triggerEl = el;
  }

  /** @internal — called by MenubarContent on mount. */
  _registerContent(el: HTMLElement | null) {
    this._contentEl = el;
  }

  /** @internal — called by MenubarTrigger before toggling the menu open. */
  _updatePosition() {
    if (this._triggerEl) {
      this._position = computeAnchorPosition(this._triggerEl, {
        side: this.side,
        align: this.align,
        offset: this.sideOffset,
      });
    }
  }

  render() {
    return <>{this.children}</>;
  }
}

@Component()
export class MenubarTrigger extends StatefulComponent {
  @Prop() menu!: MenubarMenu;
  @Prop() children?: MenubarTriggerProps["children"];
  @Prop() class?: string;
  @Prop() id?: string;

  @Ref<HTMLButtonElement>()
  triggerRef!: RefType<HTMLButtonElement>;

  onMount() {
    this.menu._registerTrigger(this.triggerRef.current);
  }

  render() {
    return (
      <button
        ref={this.triggerRef}
        id={this.id ?? this.menu.triggerId}
        type="button"
        class={this.class}
        role="menuitem"
        aria-haspopup={"menu" as const}
        aria-expanded={() => (this.menu.isOpen ? "true" : "false")}
        aria-controls={this.menu.contentId}
        onClick={() => {
          this.menu._updatePosition();
          this.menu.menubar.toggle(this.menu.value);
        }}
      >
        {this.children}
      </button>
    );
  }
}

@Component()
export class MenubarContent extends StatefulComponent {
  @Prop() menu!: MenubarMenu;
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: MenubarContentProps["children"];

  private readonly _handleDocumentMouseDown = (e: MouseEvent) => {
    if (!this.menu.isOpen) return;
    if (
      e.target instanceof Node &&
      (this.menu._triggerEl?.contains(e.target) === true || this.menu._contentEl?.contains(e.target) === true)
    ) return;
    this.menu.menubar.close();
  };

  private readonly _handleDocumentKeyDown = (e: KeyboardEvent) => {
    if (!this.menu.isOpen) return;
    if (e.key === Keys.Escape) {
      this.menu.menubar.close();
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
      <div style={{ display: "contents" }}>
        {() =>
          this.menu.isOpen && (
            <Portal>
              <div
                style={() => ({
                  position: "fixed",
                  top: `${String(this.menu._position?.top ?? 0)}px`,
                  left: `${String(this.menu._position?.left ?? 0)}px`,
                  transform: this.menu._position?.transform ?? "none",
                })}
              >
                <ul
                  id={this.id ?? this.menu.contentId}
                  ref={(el: HTMLUListElement | null) => { this.menu._registerContent(el); }}
                  role="menu"
                  class={this.class}
                  aria-labelledby={this.menu.triggerId}
                >
                  {this.children}
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
export class MenubarItem extends StatelessComponent<MenubarItemProps> {
  render() {
    const { menu, disabled, onSelect, children, label, class: cls, id } = this.props;

    return (
      <li
        id={id}
        class={cls}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled ? ("true" as const) : undefined}
        data-disabled={disabled ? "" : undefined}
        onClick={() => {
          if (!disabled) {
            onSelect?.();
            menu.menubar.close();
          }
        }}
      >
        {children ?? label}
      </li>
    );
  }
}

@Component()
export class MenubarSeparator extends StatelessComponent<MenubarSeparatorProps> {
  render() {
    const { class: cls, id } = this.props;
    return <li id={id} class={cls} role="separator" />;
  }
}
