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
// AlertDialogContent renders its own (inert, non-dismissing) backdrop, styled
// via the `[data-morphos-backdrop]` recipe in `@morphos/styles/overlays/alert-dialog.css`.
// ---------------------------------------------------------------------------

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
        <AlertDialogTrigger alertDialog={this.alertDialog} class="morphos-button morphos-button--outline">
          Publish changes
        </AlertDialogTrigger>

        <AlertDialogContent alertDialog={this.alertDialog} class="morphos-alert-dialog-content" aria-labelledby="alert-default-title">
          <div style="width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:14px;background:var(--morphos-color-info-bg)">📢</div>
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
          <p style={`display:inline-flex;align-items:center;gap:6px;margin-top:16px;padding:6px 14px;border-radius:20px;font-size:0.8rem;font-weight:500;${this.lastAction === "published" ? "background:var(--morphos-color-danger-bg);color:var(--morphos-color-danger)" : "background:var(--morphos-color-success-bg);color:var(--morphos-color-success)"}`}>
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
        <AlertDialogTrigger alertDialog={this.alertDialog} class="morphos-button morphos-button--outline morphos-button--danger">
          Delete account
        </AlertDialogTrigger>

        <AlertDialogContent alertDialog={this.alertDialog} class="morphos-alert-dialog-content" aria-labelledby="alert-delete-title">
          <div style="width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:14px;background:var(--morphos-color-danger-bg)">🗑️</div>
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
              class="morphos-alert-dialog-action morphos-alert-dialog-action--danger"
              onClick={() => { this.lastAction = "deleted"; }}
            >
              Yes, delete permanently
            </AlertDialogAction>
          </div>
        </AlertDialogContent>

        {() => this.lastAction && (
          <p style={`display:inline-flex;align-items:center;gap:6px;margin-top:16px;padding:6px 14px;border-radius:20px;font-size:0.8rem;font-weight:500;${this.lastAction === "deleted" ? "background:var(--morphos-color-danger-bg);color:var(--morphos-color-danger)" : "background:var(--morphos-color-success-bg);color:var(--morphos-color-success)"}`}>
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
