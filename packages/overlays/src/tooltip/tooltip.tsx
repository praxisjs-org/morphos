import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Prop, Ref, State, type Ref as RefType  } from "@praxisjs/decorators";
import { Portal } from "@praxisjs/runtime";

import {
  computeAnchorPosition,
  generateId,
  type AnchorAlign,
  type AnchorPosition,
  type AnchorSide,
} from "@morphos/core";

import type {
  TooltipContentProps,
  TooltipProps,
  TooltipTriggerProps,
} from "./tooltip.types";

@Component()
export class Tooltip extends StatefulComponent {
  @Prop() openDelay = 500;
  @Prop() closeDelay = 0;
  @Prop() side: AnchorSide = "top";
  @Prop() align: AnchorAlign = "center";
  @Prop() sideOffset = 4;
  @Prop() children?: TooltipProps["children"];

  @State() _open = false;
  @State() _position: AnchorPosition | null = null;

  private _openTimer: ReturnType<typeof setTimeout> | null = null;
  private _closeTimer: ReturnType<typeof setTimeout> | null = null;
  private _triggerEl: HTMLElement | null = null;

  readonly contentId = generateId("tooltip");

  onBeforeMount() {
    this._open = false;
    this._position = null;
  }

  get isOpen(): boolean {
    return this._open;
  }

  /** @internal — called by TooltipTrigger on mount. */
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

  show() {
    this._cancelClose();
    this._openTimer = setTimeout(() => {
      this._updatePosition();
      this._open = true;
    }, this.openDelay);
  }

  hide() {
    this._cancelOpen();
    this._closeTimer = setTimeout(() => {
      this._open = false;
    }, this.closeDelay);
  }

  onUnmount() {
    this._cancelOpen();
    this._cancelClose();
  }

  private _cancelOpen() {
    if (this._openTimer !== null) {
      clearTimeout(this._openTimer);
      this._openTimer = null;
    }
  }

  private _cancelClose() {
    if (this._closeTimer !== null) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
  }

  render() {
    return <>{this.children}</>;
  }
}

@Component()
export class TooltipTrigger extends StatefulComponent {
  @Prop() tooltip!: Tooltip;
  @Prop() children?: TooltipTriggerProps["children"];
  @Prop() class?: string;
  @Prop() id?: string;

  @Ref<HTMLSpanElement>()
  triggerRef!: RefType<HTMLSpanElement>;

  onMount() {
    this.tooltip._registerTrigger(this.triggerRef.current);
  }

  render() {
    return (
      <span
        ref={this.triggerRef}
        id={this.id}
        class={this.class}
        aria-describedby={this.tooltip.contentId}
        data-open={() => (this.tooltip.isOpen ? "" : undefined)}
        onMouseEnter={() => { this.tooltip.show(); }}
        onMouseLeave={() => { this.tooltip.hide(); }}
        onFocus={() => { this.tooltip.show(); }}
        onBlur={() => { this.tooltip.hide(); }}
      >
        {this.children}
      </span>
    );
  }
}

@Component()
export class TooltipContent extends StatelessComponent<TooltipContentProps> {
  render() {
    const { tooltip, children, class: cls, id, "aria-label": ariaLabel } = this.props;
    return (
      <div style={{ display: "contents" }}>
        {() =>
          tooltip.isOpen && (
            <Portal>
              <div
                style={() => ({
                  position: "fixed",
                  top: `${String(tooltip._position?.top ?? 0)}px`,
                  left: `${String(tooltip._position?.left ?? 0)}px`,
                  transform: tooltip._position?.transform ?? "none",
                })}
              >
                <div
                  id={id ?? tooltip.contentId}
                  role="tooltip"
                  class={cls}
                  aria-label={ariaLabel}
                  data-open=""
                >
                  {children}
                </div>
              </div>
            </Portal>
          )
        }
      </div>
    );
  }
}
