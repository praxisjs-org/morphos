import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Emit, Prop, Ref, State, Watch, type Ref as RefType  } from "@praxisjs/decorators";
import { Portal } from "@praxisjs/runtime";

import { generateId, Keys, lockScroll, trapFocus } from "@morphos/core";

import type {
  AlertDialogActionProps,
  AlertDialogCancelProps,
  AlertDialogContentProps,
  AlertDialogDescriptionProps,
  AlertDialogProps,
  AlertDialogTitleProps,
  AlertDialogTriggerProps,
} from "./alert-dialog.types";

@Component()
export class AlertDialog extends StatefulComponent {
  @Prop() open?: boolean;
  @Prop() defaultOpen = false;
  @Prop() onOpenChange?: AlertDialogProps["onOpenChange"];
  @Prop() closeOnEscape = true;
  @Prop() closeOnOutsideClick = true;
  @Prop() children?: AlertDialogProps["children"];

  @State() _open = false;

  onBeforeMount() {
    this._open = this.defaultOpen;
  }

  get isOpen(): boolean {
    return this.open ?? this._open;
  }

  @Emit("onOpenChange")
  openDialog() {
    if (this.open === undefined) this._open = true;
    return true;
  }

  @Emit("onOpenChange")
  closeDialog() {
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
export class AlertDialogTrigger extends StatelessComponent<AlertDialogTriggerProps> {
  render() {
    const { alertDialog, children, class: cls, id } = this.props;

    return (
      <button
        id={id}
        type="button"
        class={cls}
        aria-haspopup={"dialog" as const}
        aria-expanded={() => (alertDialog.isOpen ? "true" : "false")}
        data-open={() => (alertDialog.isOpen ? "" : undefined)}
        onClick={() => { alertDialog.openDialog(); }}
      >
        {children}
      </button>
    );
  }
}

@Component()
export class AlertDialogContent extends StatefulComponent {
  @Prop() alertDialog!: AlertDialog;
  @Prop() children?: AlertDialogContentProps["children"];
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() "aria-label"?: string;
  @Prop() "aria-labelledby"?: string;
  @Prop() "aria-describedby"?: string;

  @Ref<HTMLElement>()
  contentRef!: RefType<HTMLElement>;

  private _cleanupFocusTrap: (() => void) | null = null;
  private _cleanupScrollLock: (() => void) | null = null;
  private readonly _dialogId = generateId("alert-dialog");

  onMount() {
    if (this.alertDialog.isOpen) {
      this._applyConstraints();
    }
  }

  onUnmount() {
    this._releaseConstraints();
  }

  /** Tracked by `@Watch` below — `alertDialog.isOpen` lives on a sibling instance, not on `this`. */
  get isDialogOpen(): boolean {
    return this.alertDialog.isOpen;
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

  private readonly _handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === Keys.Escape && this.alertDialog.closeOnEscape) {
      event.preventDefault();
      this.alertDialog.closeDialog();
    }
  };

  private readonly _handleBackdropClick = () => {
    if (this.alertDialog.closeOnOutsideClick) {
      this.alertDialog.closeDialog();
    }
  };

  render() {
    return (
      <div style={{ display: "contents" }}>
        {() =>
          this.alertDialog.isOpen && (
            <Portal>
              <div data-morphos-backdrop="" onClick={this._handleBackdropClick} />
              <div
                id={this.id ?? this._dialogId}
                ref={this.contentRef}
                role="alertdialog"
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
export class AlertDialogTitle extends StatelessComponent<AlertDialogTitleProps> {
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
export class AlertDialogDescription extends StatelessComponent<AlertDialogDescriptionProps> {
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
export class AlertDialogAction extends StatelessComponent<AlertDialogActionProps> {
  render() {
    const { alertDialog, children, class: cls, id, onClick } = this.props;
    return (
      <button
        id={id}
        type="button"
        class={cls}
        onClick={() => {
          alertDialog.closeDialog();
          onClick?.();
        }}
      >
        {children}
      </button>
    );
  }
}

@Component()
export class AlertDialogCancel extends StatelessComponent<AlertDialogCancelProps> {
  render() {
    const { alertDialog, children, class: cls, id, onClick } = this.props;
    return (
      <button
        id={id}
        type="button"
        class={cls}
        onClick={() => {
          alertDialog.closeDialog();
          onClick?.();
        }}
      >
        {children}
      </button>
    );
  }
}
