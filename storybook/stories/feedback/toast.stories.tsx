import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { ToastProvider } from "@morphos/feedback";

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: "Feedback/Toast",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Notification queue backed by `ToastProvider`. Call `provider.add({ title, variant, duration })` " +
          "to enqueue toasts; they auto-dismiss after `duration` ms (default 5 s). " +
          "Set `duration: 0` to keep a toast until the user explicitly dismisses it. " +
          "The provider renders into a `Portal` — wire up your own list UI to `provider.toasts`. " +
          "Styled here with the `@morphos/styles` `morphos-toast-viewport` recipe.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

// ---------------------------------------------------------------------------
// Default — four variant buttons + live toast list
// ---------------------------------------------------------------------------

@Component()
class DefaultDemo extends StatefulComponent {
  @State() provider = new ToastProvider();

  onBeforeMount() {
    this.provider = new ToastProvider();
    this.provider.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;min-height:160px">
        <h4 style="margin:0 0 12px;font-size:.875rem;color:var(--morphos-color-text-muted);font-weight:500;text-transform:uppercase;letter-spacing:.05em">
          Trigger a toast
        </h4>

        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
          <button
            type="button"
            class="morphos-button morphos-button--outline"
            onClick={() => {
              this.provider.add({
                title: "Saved!",
                description: "Your changes have been saved.",
                variant: "success",
              });
            }}
          >
            Success
          </button>

          <button
            type="button"
            class="morphos-button morphos-button--outline"
            onClick={() => {
              this.provider.add({
                title: "Upload failed",
                description: "Only JPEG and PNG files are supported.",
                variant: "error",
              });
            }}
          >
            Error
          </button>

          <button
            type="button"
            class="morphos-button morphos-button--outline"
            onClick={() => {
              this.provider.add({
                title: "Storage almost full",
                description: "You have used 90% of your quota.",
                variant: "warning",
              });
            }}
          >
            Warning
          </button>

          <button
            type="button"
            class="morphos-button morphos-button--outline"
            onClick={() => {
              this.provider.add({
                title: "Update available",
                description: "A new version is ready to install.",
                variant: "info",
              });
            }}
          >
            Info
          </button>

          <button
            type="button"
            class="morphos-button morphos-button--outline"
            onClick={() => { this.provider.clear(); }}
          >
            Clear all
          </button>
        </div>

        <p style="margin:0;font-size:.78rem;color:var(--morphos-color-text-muted)">
          Toasts auto-dismiss after 5 s. Check bottom-right of the viewport.
        </p>

        {/* Render the list reactively from provider.toasts */}
        <div
          role="region"
          aria-label="Notifications"
          aria-live="polite"
          class="morphos-toast-viewport"
        >
          {() =>
            this.provider.toasts.map((toast) => (
              <div
                key={toast.id}
                role="status"
                data-variant={toast.variant ?? "info"}
              >
                <div style="flex:1;min-width:0">
                  <div style="font-weight:600">{toast.title}</div>
                  {toast.description && (
                    <div style="font-size:.8em;opacity:.8;margin-top:2px">{toast.description}</div>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Dismiss notification"
                  onClick={() => { this.provider.dismiss(toast.id); }}
                >
                  ×
                </button>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

// ---------------------------------------------------------------------------
// Persistent — duration: 0, toast stays until manually dismissed
// ---------------------------------------------------------------------------

@Component()
class PersistentDemo extends StatefulComponent {
  @State() provider = new ToastProvider();

  onBeforeMount() {
    this.provider = new ToastProvider();
    this.provider.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;min-height:160px">
        <h4 style="margin:0 0 8px;font-size:.875rem;color:var(--morphos-color-text-muted);font-weight:500;text-transform:uppercase;letter-spacing:.05em">
          Persistent toast (duration: 0)
        </h4>
        <p style="margin:0 0 12px;font-size:.875rem;color:var(--morphos-color-text)">
          These toasts will not auto-dismiss. The user must press × to close them.
        </p>

        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
          <button
            type="button"
            class="morphos-button morphos-button--outline"
            onClick={() => {
              this.provider.add({
                title: "Action required",
                description: "Please verify your email address before continuing.",
                variant: "warning",
                duration: 0,
              });
            }}
          >
            Add persistent warning
          </button>

          <button
            type="button"
            class="morphos-button morphos-button--outline"
            onClick={() => {
              this.provider.add({
                title: "Critical error",
                description: "Database connection lost. Contact your administrator.",
                variant: "error",
                duration: 0,
              });
            }}
          >
            Add persistent error
          </button>

          <button
            type="button"
            class="morphos-button morphos-button--outline"
            onClick={() => { this.provider.clear(); }}
          >
            Clear all
          </button>
        </div>

        <div
          role="region"
          aria-label="Notifications"
          aria-live="polite"
          class="morphos-toast-viewport"
        >
          {() =>
            this.provider.toasts.map((toast) => (
              <div
                key={toast.id}
                role="status"
                data-variant={toast.variant ?? "info"}
              >
                <div style="flex:1;min-width:0">
                  <div style="font-weight:600">{toast.title}</div>
                  {toast.description && (
                    <div style="font-size:.8em;opacity:.8;margin-top:2px">{toast.description}</div>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Dismiss notification"
                  onClick={() => { this.provider.dismiss(toast.id); }}
                >
                  ×
                </button>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

export const Persistent: Story = {
  name: "Persistent",
  render: () => <PersistentDemo />,
};
