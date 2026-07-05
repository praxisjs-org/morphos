import { StatefulComponent } from "@praxisjs/core";
import { Component, Emit, Prop, Ref, State, type Ref as RefType  } from "@praxisjs/decorators";
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
  PopoverContentProps,
  PopoverProps,
  PopoverTriggerProps,
} from "./popover.types";

@Component()
export class Popover extends StatefulComponent {
  @Prop() open?: boolean;
  @Prop() defaultOpen = false;
  @Prop() onOpenChange?: PopoverProps["onOpenChange"];
  @Prop() closeOnEscape = true;
  @Prop() closeOnOutsideClick = true;
  @Prop() side: AnchorSide = "bottom";
  @Prop() align: AnchorAlign = "start";
  @Prop() sideOffset = 4;
  @Prop() children?: PopoverProps["children"];

  @State() _open = false;
  @State() _position: AnchorPosition | null = null;

  /** @internal — the registered trigger element; read by `PopoverContent` to exclude it from outside-click detection. */
  _triggerEl: HTMLElement | null = null;

  readonly contentId = generateId("popover");

  onBeforeMount() {
    this._open = this.defaultOpen;
    this._position = null;
  }

  get isOpen(): boolean {
    return this.open ?? this._open;
  }

  /** @internal — called by PopoverTrigger on mount. */
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
  toggle() {
    const next = !this.isOpen;
    if (next) this._updatePosition();
    if (this.open === undefined) this._open = next;
    return next;
  }

  @Emit("onOpenChange")
  closePopover() {
    if (this.open === undefined) this._open = false;
    return false;
  }

  render() {
    return <>{this.children}</>;
  }
}

@Component()
export class PopoverTrigger extends StatefulComponent {
  @Prop() popover!: Popover;
  @Prop() children?: PopoverTriggerProps["children"];
  @Prop() class?: string;
  @Prop() id?: string;

  @Ref<HTMLButtonElement>()
  triggerRef!: RefType<HTMLButtonElement>;

  onMount() {
    this.popover._registerTrigger(this.triggerRef.current);
  }

  render() {
    return (
      <button
        ref={this.triggerRef}
        id={this.id}
        type="button"
        class={this.class}
        aria-haspopup={"true" as const}
        aria-expanded={() => (this.popover.isOpen ? "true" : "false")}
        aria-controls={this.popover.contentId}
        data-open={() => (this.popover.isOpen ? "" : undefined)}
        onClick={() => { this.popover.toggle(); }}
      >
        {this.children}
      </button>
    );
  }
}

@Component()
export class PopoverContent extends StatefulComponent {
  @Prop() popover!: Popover;
  @Prop() children?: PopoverContentProps["children"];
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() "aria-label"?: string;
  @Prop() "aria-labelledby"?: string;

  @Ref<HTMLElement>()
  contentRef!: RefType<HTMLElement>;

  private readonly _handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === Keys.Escape && this.popover.closeOnEscape) {
      event.preventDefault();
      this.popover.closePopover();
    }
  };

  private readonly _handleOutsideClick = (event: MouseEvent) => {
    if (
      this.popover.closeOnOutsideClick &&
      event.target instanceof Node &&
      this.contentRef.current?.contains(event.target) !== true &&
      this.popover._triggerEl?.contains(event.target) !== true
    ) {
      this.popover.closePopover();
    }
  };

  onMount() {
    document.addEventListener("mousedown", this._handleOutsideClick);
    document.addEventListener("keydown", this._handleKeyDown);
  }

  onUnmount() {
    document.removeEventListener("mousedown", this._handleOutsideClick);
    document.removeEventListener("keydown", this._handleKeyDown);
  }

  render() {
    return (
      <div style={{ display: "contents" }}>
        {() =>
          this.popover.isOpen && (
            <Portal>
              <div
                style={() => ({
                  position: "fixed",
                  top: `${String(this.popover._position?.top ?? 0)}px`,
                  left: `${String(this.popover._position?.left ?? 0)}px`,
                  transform: this.popover._position?.transform ?? "none",
                })}
              >
                <div
                  id={this.id ?? this.popover.contentId}
                  ref={this.contentRef}
                  role="dialog"
                  aria-label={this["aria-label"]}
                  aria-labelledby={this["aria-labelledby"]}
                  class={this.class}
                  data-open=""
                >
                  {this.children}
                </div>
              </div>
            </Portal>
          )
        }
      </div>
    );
  }
}
