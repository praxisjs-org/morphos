import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@morphos/overlays";

// ---------------------------------------------------------------------------
// Shared styles — layout/demo-only rules not covered by @morphos/styles.
// AlertDialogContent renders its own (inert, non-dismissing) backdrop, styled
// via the `[data-morphos-backdrop]` recipe in `@morphos/styles/overlays/alert-dialog.css`.
// ---------------------------------------------------------------------------

const SHARED_STYLES = `
  .alert-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    margin-bottom: 14px;
  }
  .alert-icon-danger { background: #fef2f2; }
  .btn-trigger-danger {
    background: transparent;
    border-color: #dc2626;
    color: #dc2626;
  }
  .btn-trigger-danger:hover { background: #fef2f2; }
  .result-note {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 16px;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
  }
  .result-confirmed { background: #fef2f2; color: #dc2626; }
  .result-cancelled { background: #f0fdf4; color: #16a34a; }
`;

// ---------------------------------------------------------------------------
// Default story — "Are you sure?" confirmation
// ---------------------------------------------------------------------------

@Component()
class AlertDialogDefaultDemo extends StatefulComponent {
  @State() alertDialog = new AlertDialog();
  @State() lastAction = "";

  onBeforeMount() {
    this.alertDialog.onBeforeMount?.();
    this.lastAction = "";
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:40px">
        <style>{SHARED_STYLES}</style>
        <AlertDialogTrigger alertDialog={this.alertDialog} class="morphos-button morphos-button--outline">
          Publish changes
        </AlertDialogTrigger>

        <AlertDialogContent alertDialog={this.alertDialog} class="morphos-alert-dialog-content" aria-labelledby="alert-default-title">
          <div class="alert-icon" style="background:#eff6ff">📢</div>
          <AlertDialogTitle id="alert-default-title" class="morphos-alert-dialog-title">
            Publish these changes?
          </AlertDialogTitle>
          <AlertDialogDescription class="morphos-alert-dialog-description">
            Your updates will be immediately visible to all users. Make sure all
            content has been reviewed before publishing.
          </AlertDialogDescription>
          <div style="display:flex;justify-content:flex-end;gap:8px">
            <AlertDialogCancel
              alertDialog={this.alertDialog}
              class="morphos-alert-dialog-cancel"
              onClick={() => { this.lastAction = "cancelled"; }}
            >
              Review again
            </AlertDialogCancel>
            <AlertDialogAction
              alertDialog={this.alertDialog}
              class="morphos-alert-dialog-action"
              onClick={() => { this.lastAction = "published"; }}
            >
              Publish now
            </AlertDialogAction>
          </div>
        </AlertDialogContent>

        {() => this.lastAction && (
          <p class={`result-note ${this.lastAction === "published" ? "result-confirmed" : "result-cancelled"}`}>
            {this.lastAction === "published" ? "Changes published" : "Publishing cancelled"}
          </p>
        )}
      </div>
    );
  }
}

// ---------------------------------------------------------------------------
// DestructiveDelete story — "Delete account?" danger confirmation
// ---------------------------------------------------------------------------

@Component()
class AlertDialogDestructiveDeleteDemo extends StatefulComponent {
  @State() alertDialog = new AlertDialog();
  @State() lastAction = "";

  onBeforeMount() {
    this.alertDialog.onBeforeMount?.();
    this.lastAction = "";
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:40px">
        <style>{SHARED_STYLES}</style>
        <AlertDialogTrigger alertDialog={this.alertDialog} class="morphos-button morphos-button--outline btn-trigger-danger">
          Delete account
        </AlertDialogTrigger>

        <AlertDialogContent alertDialog={this.alertDialog} class="morphos-alert-dialog-content" aria-labelledby="alert-delete-title">
          <div class="alert-icon alert-icon-danger">🗑️</div>
          <AlertDialogTitle id="alert-delete-title" class="morphos-alert-dialog-title">
            Delete your account?
          </AlertDialogTitle>
          <AlertDialogDescription class="morphos-alert-dialog-description">
            This action is permanent and cannot be undone. All your data, projects,
            billing history, and settings will be permanently erased from our servers.
            There is no recovery option.
          </AlertDialogDescription>
          <div style="display:flex;justify-content:flex-end;gap:8px">
            <AlertDialogCancel
              alertDialog={this.alertDialog}
              class="morphos-alert-dialog-cancel"
              onClick={() => { this.lastAction = "cancelled"; }}
            >
              Keep my account
            </AlertDialogCancel>
            <AlertDialogAction
              alertDialog={this.alertDialog}
              class="morphos-alert-dialog-action"
              onClick={() => { this.lastAction = "deleted"; }}
            >
              Yes, delete permanently
            </AlertDialogAction>
          </div>
        </AlertDialogContent>

        {() => this.lastAction && (
          <p class={`result-note ${this.lastAction === "deleted" ? "result-confirmed" : "result-cancelled"}`}>
            {this.lastAction === "deleted" ? "Account deletion confirmed" : "Deletion cancelled — account is safe"}
          </p>
        )}
      </div>
    );
  }
}

// ---------------------------------------------------------------------------
// Meta + story exports
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: "Overlays/AlertDialog",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => <AlertDialogDefaultDemo />,
};

export const DestructiveDelete: Story = {
  name: "Destructive Delete",
  render: () => <AlertDialogDestructiveDeleteDemo />,
};
