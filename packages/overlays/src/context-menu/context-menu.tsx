import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Emit, Prop, Ref, State, type Ref as RefType  } from "@praxisjs/decorators";
import { Portal } from "@praxisjs/runtime";

import { Keys } from "@morphos/core";

import type {
  ContextMenuContentProps,
  ContextMenuItemProps,
  ContextMenuProps,
  ContextMenuTriggerProps,
} from "./context-menu.types";

@Component()
export class ContextMenu extends StatefulComponent {
  @Prop() onOpenChange?: ContextMenuProps["onOpenChange"];
  @Prop() children?: ContextMenuProps["children"];

  @State() _open = false;
  @State() _x = 0;
  @State() _y = 0;

  @Emit("onOpenChange")
  private _emitOpenChange(open: boolean) {
    return open;
  }

  onBeforeMount() {
    this._open = false;
    this._x = 0;
    this._y = 0;
  }

  get isOpen(): boolean {
    return this._open;
  }

  open(): void {
    this._open = true;
    this._emitOpenChange(true);
  }

  close(): void {
    this._open = false;
    this._emitOpenChange(false);
  }

  setPosition(x: number, y: number): void {
    this._x = x;
    this._y = y;
  }

  render() {
    return <>{this.children}</>;
  }
}

@Component()
export class ContextMenuTrigger extends StatelessComponent<ContextMenuTriggerProps> {
  render() {
    const { contextMenu, children, class: cls, id } = this.props;

    return (
      <div
        id={id}
        class={cls}
        data-open={() => (contextMenu.isOpen ? "" : undefined)}
        onContextMenu={(e: MouseEvent) => {
          e.preventDefault();
          contextMenu.setPosition(e.clientX, e.clientY);
          contextMenu.open();
        }}
      >
        {children}
      </div>
    );
  }
}

@Component()
export class ContextMenuContent extends StatefulComponent {
  @Prop() contextMenu!: ContextMenu;
  @Prop() children?: ContextMenuContentProps["children"];
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() "aria-label"?: string;

  @Ref<HTMLElement>()
  contentRef!: RefType<HTMLElement>;

  private readonly _handleOutsideClick = (event: MouseEvent) => {
    if (
      this.contentRef.current &&
      event.target instanceof Node &&
      !this.contentRef.current.contains(event.target)
    ) {
      this.contextMenu.close();
    }
  };

  private readonly _handleDocumentKeyDown = (event: KeyboardEvent) => {
    if (event.key === Keys.Escape && this.contextMenu.isOpen) {
      event.preventDefault();
      this.contextMenu.close();
    }
  };

  onMount() {
    document.addEventListener("mousedown", this._handleOutsideClick);
    document.addEventListener("keydown", this._handleDocumentKeyDown);
  }

  onUnmount() {
    document.removeEventListener("mousedown", this._handleOutsideClick);
    document.removeEventListener("keydown", this._handleDocumentKeyDown);
  }

  render() {
    return (
      <div style={{ display: "contents" }}>
        {() =>
          this.contextMenu.isOpen && (
            <Portal>
              <ul
                id={this.id}
                ref={this.contentRef}
                role="menu"
                class={this.class}
                aria-label={this["aria-label"]}
                data-open=""
                style={() => ({
                  position: "fixed",
                  left: `${String(this.contextMenu._x)}px`,
                  top: `${String(this.contextMenu._y)}px`,
                })}
              >
                {this.children}
              </ul>
            </Portal>
          )
        }
      </div>
    );
  }
}

@Component()
export class ContextMenuItem extends StatefulComponent {
  @Prop() contextMenu!: ContextMenu;
  @Prop() value!: string;
  @Prop() label?: string;
  @Prop() disabled = false;
  @Prop() onSelect?: ContextMenuItemProps["onSelect"];
  @Prop() children?: ContextMenuItemProps["children"];
  @Prop() class?: string;
  @Prop() id?: string;

  @Ref<HTMLLIElement>()
  itemRef!: RefType<HTMLLIElement>;

  // @Emit calls the prop callback directly when the method has no return
  // value and no arguments to forward.
  @Emit("onSelect")
  private _emitSelect(): void {
    return;
  }

  private readonly _handleSelect = () => {
    if (this.disabled) return;
    this._emitSelect();
    this.contextMenu.close();
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
