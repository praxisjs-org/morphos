import { StatefulComponent } from "@praxisjs/core";
import { Component, Emit, Prop, Ref, State, type Ref as RefType  } from "@praxisjs/decorators";
import { Portal } from "@praxisjs/runtime";

import {
  computeAnchorPosition,
  generateId,
  type AnchorAlign,
  type AnchorPosition,
  type AnchorSide,
} from "@morphos/core";

import type {
  PreviewCardContentProps,
  PreviewCardProps,
  PreviewCardTriggerProps,
} from "./preview-card.types";

@Component()
export class PreviewCard extends StatefulComponent {
  @Prop() open?: boolean;
  @Prop() defaultOpen?: boolean;
  @Prop() onOpenChange?: PreviewCardProps["onOpenChange"];
  @Prop() openDelay = 300;
  @Prop() closeDelay = 100;
  @Prop() side: AnchorSide = "bottom";
  @Prop() align: AnchorAlign = "start";
  @Prop() sideOffset = 4;
  @Prop() children?: PreviewCardProps["children"];

  @State() _open = false;
  @State() _position: AnchorPosition | null = null;

  private _openTimer: number | null = null;
  private _closeTimer: number | null = null;
  private _triggerEl: HTMLElement | null = null;

  readonly contentId = generateId("preview-card");

  onBeforeMount() {
    this._open = this.defaultOpen ?? false;
    this._position = null;
  }

  get isOpen(): boolean {
    return this.open ?? this._open;
  }

  /** @internal — called by PreviewCardTrigger on mount. */
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

  openWithDelay(): void {
    if (this._closeTimer !== null) {
      window.clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
    this._openTimer = window.setTimeout(() => {
      this.openCard();
    }, this.openDelay);
  }

  closeWithDelay(): void {
    if (this._openTimer !== null) {
      window.clearTimeout(this._openTimer);
      this._openTimer = null;
    }
    this._closeTimer = window.setTimeout(() => {
      this.closeCard();
    }, this.closeDelay);
  }

  @Emit("onOpenChange")
  openCard() {
    this._updatePosition();
    if (this.open === undefined) this._open = true;
    return true;
  }

  @Emit("onOpenChange")
  closeCard() {
    if (this.open === undefined) this._open = false;
    return false;
  }

  render() {
    return <>{this.children}</>;
  }
}

@Component()
export class PreviewCardTrigger extends StatefulComponent {
  @Prop() card!: PreviewCard;
  @Prop() children?: PreviewCardTriggerProps["children"];
  @Prop() class?: string;
  @Prop() id?: string;

  @Ref<HTMLSpanElement>()
  triggerRef!: RefType<HTMLSpanElement>;

  onMount() {
    this.card._registerTrigger(this.triggerRef.current);
  }

  render() {
    return (
      <span
        ref={this.triggerRef}
        id={this.id}
        class={this.class}
        aria-describedby={this.card.contentId}
        onMouseEnter={() => { this.card.openWithDelay(); }}
        onMouseLeave={() => { this.card.closeWithDelay(); }}
        onFocus={() => { this.card.openWithDelay(); }}
        onBlur={() => { this.card.closeWithDelay(); }}
      >
        {this.children}
      </span>
    );
  }
}

@Component()
export class PreviewCardContent extends StatefulComponent {
  @Prop() card!: PreviewCard;
  @Prop() children?: PreviewCardContentProps["children"];
  @Prop() class?: string;
  @Prop() id?: string;

  render() {
    return (
      <div style={{ display: "contents" }}>
        {() =>
          this.card.isOpen && (
            <Portal>
              <div
                style={() => ({
                  position: "fixed",
                  top: `${String(this.card._position?.top ?? 0)}px`,
                  left: `${String(this.card._position?.left ?? 0)}px`,
                  transform: this.card._position?.transform ?? "none",
                })}
              >
                <div
                  id={this.id ?? this.card.contentId}
                  role="tooltip"
                  class={this.class}
                  data-open=""
                  onMouseEnter={() => { this.card.openWithDelay(); }}
                  onMouseLeave={() => { this.card.closeWithDelay(); }}
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
