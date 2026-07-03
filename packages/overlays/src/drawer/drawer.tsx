import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Emit, Prop, Ref, State, Watch, type Ref as RefType  } from "@praxisjs/decorators";
import { Portal } from "@praxisjs/runtime";

import { generateId, Keys, lockScroll, trapFocus } from "@morphos/core";

import type {
  DrawerCloseProps,
  DrawerContentProps,
  DrawerDescriptionProps,
  DrawerProps,
  DrawerSide,
  DrawerTitleProps,
  DrawerTriggerProps,
} from "./drawer.types";

@Component()
export class Drawer extends StatefulComponent {
  @Prop() open?: boolean;
  @Prop() defaultOpen = false;
  @Prop() onOpenChange?: DrawerProps["onOpenChange"];
  @Prop() closeOnEscape = true;
  @Prop() closeOnBackdropClick = true;
  @Prop() side: DrawerSide = "right";
  @Prop() children?: DrawerProps["children"];

  @State() _open = false;

  onBeforeMount() {
    this._open = this.defaultOpen;
  }

  get isOpen(): boolean {
    return this.open ?? this._open;
  }

  @Emit("onOpenChange")
  openDrawer() {
    if (this.open === undefined) this._open = true;
    return true;
  }

  @Emit("onOpenChange")
  closeDrawer() {
    if (this.open === undefined) this._open = false;
    return false;
  }

  @Emit("onOpenChange")
  toggle() {
    const next = !this.isOpen;
    if (this.open === undefined) this._open = next;
    return next;
  }

  render() {
    return <>{this.children}</>;
  }
}

@Component()
export class DrawerTrigger extends StatelessComponent<DrawerTriggerProps> {
  render() {
    const { drawer, children, class: cls, id } = this.props;

    return (
      <button
        id={id}
        type="button"
        class={cls}
        aria-haspopup={"dialog" as const}
        aria-expanded={() => (drawer.isOpen ? "true" : "false")}
        data-open={() => (drawer.isOpen ? "" : undefined)}
        onClick={() => { drawer.openDrawer(); }}
      >
        {children}
      </button>
    );
  }
}

@Component()
export class DrawerContent extends StatefulComponent {
  @Prop() drawer!: Drawer;
  @Prop() children?: DrawerContentProps["children"];
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() "aria-label"?: string;
  @Prop() "aria-labelledby"?: string;
  @Prop() "aria-describedby"?: string;

  @Ref<HTMLElement>()
  contentRef!: RefType<HTMLElement>;

  private _cleanupFocusTrap: (() => void) | null = null;
  private _cleanupScrollLock: (() => void) | null = null;
  private readonly _drawerId = generateId("drawer");

  onMount() {
    if (this.drawer.isOpen) {
      this._applyConstraints();
    }
  }

  onUnmount() {
    this._releaseConstraints();
  }

  /** Tracked by `@Watch` below — `drawer.isOpen` lives on a sibling instance, not on `this`. */
  get isDrawerOpen(): boolean {
    return this.drawer.isOpen;
  }

  @Watch("isDrawerOpen")
  private _handleOpenChange(isOpen: boolean) {
    if (isOpen) {
      this._applyConstraints();
    } else {
      this._releaseConstraints();
    }
  }

  private _applyConstraints() {
    if (this.contentRef.current) {
      this._cleanupFocusTrap = trapFocus(this.contentRef.current);
    }
    this._cleanupScrollLock = lockScroll();
  }

  private _releaseConstraints() {
    this._cleanupFocusTrap?.();
    this._cleanupScrollLock?.();
    this._cleanupFocusTrap = null;
    this._cleanupScrollLock = null;
  }

  private readonly _handleBackdropClick = () => {
    if (this.drawer.closeOnBackdropClick) {
      this.drawer.closeDrawer();
    }
  };

  private readonly _handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === Keys.Escape && this.drawer.closeOnEscape) {
      event.preventDefault();
      this.drawer.closeDrawer();
    }
  };

  render() {
    return (
      <div style={{ display: "contents" }}>
        {() =>
          this.drawer.isOpen && (
            <Portal>
              <div
                data-morphos-backdrop=""
                onClick={this._handleBackdropClick}
              />
              <div
                id={this.id ?? this._drawerId}
                ref={this.contentRef}
                role="dialog"
                aria-modal={"true" as const}
                aria-label={this["aria-label"]}
                aria-labelledby={this["aria-labelledby"]}
                aria-describedby={this["aria-describedby"]}
                class={this.class}
                data-open=""
                data-side={() => this.drawer.side}
                onKeyDown={this._handleKeyDown}
              >
                {this.children}
              </div>
            </Portal>
          )
        }
      </div>
    );
  }
}

@Component()
export class DrawerTitle extends StatelessComponent<DrawerTitleProps> {
  render() {
    const { as: Tag = "h2", children, class: cls, id } = this.props;
    return (
      <Tag id={id} class={cls}>
        {children}
      </Tag>
    );
  }
}

@Component()
export class DrawerDescription extends StatelessComponent<DrawerDescriptionProps> {
  render() {
    const { children, class: cls, id } = this.props;
    return (
      <p id={id} class={cls}>
        {children}
      </p>
    );
  }
}

@Component()
export class DrawerClose extends StatelessComponent<DrawerCloseProps> {
  render() {
    const { drawer, children, class: cls, id } = this.props;
    return (
      <button
        id={id}
        type="button"
        class={cls}
        aria-label="Close drawer"
        onClick={() => { drawer.closeDrawer(); }}
      >
        {children}
      </button>
    );
  }
}
