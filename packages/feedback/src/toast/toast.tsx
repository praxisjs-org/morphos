import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Prop, State } from "@praxisjs/decorators";
import { Portal } from "@praxisjs/runtime";

import { generateId } from "@morphos/core";

import type { ToastItem, ToastProps, ToastProviderProps } from "./toast.types";

@Component()
export class ToastProvider extends StatefulComponent {
  @Prop() defaultDuration = 5000;
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: ToastProviderProps["children"];

  @State() _toasts: ToastItem[] = [];

  onBeforeMount() {
    this._toasts = [];
  }

  /** Adds a toast and returns its ID. */
  add(toast: Omit<ToastItem, "id">): string {
    const id = generateId("toast");
    const item: ToastItem = { id, duration: this.defaultDuration, ...toast };

    this._toasts = [...this._toasts, item];

    if (item.duration && item.duration > 0) {
      setTimeout(() => { this.dismiss(id); }, item.duration);
    }

    return id;
  }

  /** Removes a toast by ID. */
  dismiss(id: string) {
    this._toasts = this._toasts.filter((t) => t.id !== id);
  }

  /** Removes all toasts. */
  clear() {
    this._toasts = [];
  }

  get toasts(): ToastItem[] {
    return this._toasts;
  }

  render() {
    return (
      <>
        {this.children}
        <Portal>
          <div
            id={this.id}
            role="region"
            aria-label="Notifications"
            aria-live={"polite" as const}
            aria-atomic={"false" as const}
            class={this.class}
          >
            {() =>
              this._toasts.map((toast) => (
                <div
                  key={toast.id}
                  role="status"
                  aria-live={"polite" as const}
                  data-variant={toast.variant ?? "info"}
                >
                  <span>{toast.title}</span>
                  {toast.description && <span>{toast.description}</span>}
                  <button
                    type="button"
                    aria-label="Dismiss notification"
                    onClick={() => { this.dismiss(toast.id); }}
                  >
                    ×
                  </button>
                </div>
              ))
            }
          </div>
        </Portal>
      </>
    );
  }
}

@Component()
export class Toast extends StatelessComponent<ToastProps> {
  render() {
    const { toast, provider, children, class: cls, id } = this.props;
    return (
      <div
        id={id ?? toast.id}
        role="status"
        aria-live={"polite" as const}
        class={cls}
        data-variant={toast.variant ?? "info"}
      >
        {children ?? (
          <>
            <span>{toast.title}</span>
            {toast.description && <span>{toast.description}</span>}
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => { provider.dismiss(toast.id); }}
            >
              ×
            </button>
          </>
        )}
      </div>
    );
  }
}
