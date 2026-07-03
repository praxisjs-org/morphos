import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Emit, Prop, Ref, State, Watch, type Ref as RefType  } from "@praxisjs/decorators";
import { Portal } from "@praxisjs/runtime";

import { generateId, lockScroll, trapFocus, Keys } from "@morphos/core";

import type {
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogProps,
  DialogTitleProps,
  DialogTriggerProps,
} from "./dialog.types";

@Component()
export class Dialog extends StatefulComponent {
  @Prop() open?: boolean;
  @Prop() defaultOpen = false;
  @Prop() onOpenChange?: DialogProps["onOpenChange"];
  @Prop() closeOnEscape = true;
  @Prop() closeOnBackdropClick = true;
  @Prop() children?: DialogProps["children"];

  @State() _open = false;

  onBeforeMount() {
    this._open = this.defaultOpen;
  }

  /** Whether the dialog is currently open. */
  get isOpen(): boolean {
    return this.open ?? this._open;
  }

  /** Opens the dialog. */
  @Emit("onOpenChange")
  openDialog() {
    if (this.open === undefined) this._open = true;
    return true;
  }

  /** Closes the dialog. */
  @Emit("onOpenChange")
  closeDialog() {
    if (this.open === undefined) this._open = false;
    return false;
  }

  /** Toggles the dialog open state. */
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
export class DialogTrigger extends StatelessComponent<DialogTriggerProps> {
  render() {
    const { dialog, children, class: cls, id } = this.props;

    return (
      <button
        id={id}
        type="button"
        class={cls}
        aria-haspopup={"dialog" as const}
        aria-expanded={() => (dialog.isOpen ? "true" : "false")}
        data-open={() => (dialog.isOpen ? "" : undefined)}
        onClick={() => { dialog.openDialog(); }}
      >
        {children}
      </button>
    );
  }
}

@Component()
export class DialogContent extends StatefulComponent {
  @Prop() dialog!: Dialog;
  @Prop() children?: DialogContentProps["children"];
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() "aria-label"?: string;
  @Prop() "aria-labelledby"?: string;
  @Prop() "aria-describedby"?: string;

  @Ref<HTMLElement>()
  contentRef!: RefType<HTMLElement>;

  private _cleanupFocusTrap: (() => void) | null = null;
  private _cleanupScrollLock: (() => void) | null = null;
  private readonly _dialogId = generateId("dialog");

  onMount() {
    if (this.dialog.isOpen) {
      this._applyConstraints();
    }
  }

  onUnmount() {
    this._releaseConstraints();
  }

  /** Tracked by `@Watch` below — `dialog.isOpen` lives on a sibling instance, not on `this`. */
  get isDialogOpen(): boolean {
    return this.dialog.isOpen;
  }

  @Watch("isDialogOpen")
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
    if (this.dialog.closeOnBackdropClick) {
      this.dialog.closeDialog();
    }
  };

  private readonly _handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === Keys.Escape && this.dialog.closeOnEscape) {
      event.preventDefault();
      this.dialog.closeDialog();
    }
  };

  render() {
    return (
      <div style={{ display: "contents" }}>
        {() =>
          this.dialog.isOpen && (
            <Portal>
              <div
                data-morphos-backdrop=""
                onClick={this._handleBackdropClick}
              />
              <div
                id={this.id ?? this._dialogId}
                ref={this.contentRef}
                role="dialog"
                aria-modal={"true" as const}
                aria-label={this["aria-label"]}
                aria-labelledby={this["aria-labelledby"]}
                aria-describedby={this["aria-describedby"]}
                class={this.class}
                data-open=""
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
export class DialogTitle extends StatelessComponent<DialogTitleProps> {
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
export class DialogDescription extends StatelessComponent<DialogDescriptionProps> {
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
export class DialogClose extends StatelessComponent<DialogCloseProps> {
  render() {
    const { dialog, children, class: cls, id } = this.props;
    return (
      <button
        id={id}
        type="button"
        class={cls}
        aria-label="Close dialog"
        onClick={() => { dialog.closeDialog(); }}
      >
        {children}
      </button>
    );
  }
}
