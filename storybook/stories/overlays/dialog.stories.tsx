import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@morphos/overlays";

// ---------------------------------------------------------------------------
// Shared styles — layout/demo-only rules not covered by @morphos/styles
// ---------------------------------------------------------------------------

const SHARED_STYLES = `
  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 4px;
  }
  .btn-danger {
    background: #dc2626;
    border-color: #dc2626;
  }
  .btn-danger:hover { background: #b91c1c; }
  .btn-trigger-danger {
    background: transparent;
    border-color: #dc2626;
    color: #dc2626;
  }
  .btn-trigger-danger:hover { background: #fef2f2; }
  .form-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 14px;
  }
  .form-field label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #374151;
  }
`;

// ---------------------------------------------------------------------------
// Default story — standard confirmation dialog
// ---------------------------------------------------------------------------

@Component()
class DialogDefaultDemo extends StatefulComponent {
  @State() dialog = new Dialog();

  onBeforeMount() {
    this.dialog.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:40px">
        <style>{SHARED_STYLES}</style>
        <DialogTrigger dialog={this.dialog} class="morphos-button morphos-button--outline">
          Open dialog
        </DialogTrigger>
        <DialogContent dialog={this.dialog} class="morphos-dialog-content" aria-labelledby="default-title" aria-describedby="default-desc">
          <DialogTitle id="default-title" class="morphos-dialog-title">Confirm action</DialogTitle>
          <DialogDescription id="default-desc" class="morphos-dialog-description">
            Are you sure you want to proceed? This operation will save your changes
            and cannot be undone without manually reverting them.
          </DialogDescription>
          <div class="dialog-actions">
            <DialogClose dialog={this.dialog} class="morphos-button morphos-button--ghost">Cancel</DialogClose>
            <button type="button" class="morphos-button" onClick={() => { this.dialog.closeDialog(); }}>
              Confirm
            </button>
          </div>
        </DialogContent>
      </div>
    );
  }
}

// ---------------------------------------------------------------------------
// Destructive story — delete confirmation
// ---------------------------------------------------------------------------

@Component()
class DialogDestructiveDemo extends StatefulComponent {
  @State() dialog = new Dialog();

  onBeforeMount() {
    this.dialog.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:40px">
        <style>{SHARED_STYLES}</style>
        <DialogTrigger dialog={this.dialog} class="morphos-button morphos-button--outline btn-trigger-danger">
          Delete record
        </DialogTrigger>
        <DialogContent dialog={this.dialog} class="morphos-dialog-content" aria-labelledby="destr-title" aria-describedby="destr-desc">
          <DialogTitle id="destr-title" class="morphos-dialog-title">Delete this record?</DialogTitle>
          <DialogDescription id="destr-desc" class="morphos-dialog-description">
            This will permanently remove the record and all associated data. Once
            deleted, it cannot be recovered. Please make sure you have a backup
            before continuing.
          </DialogDescription>
          <div class="dialog-actions">
            <DialogClose dialog={this.dialog} class="morphos-button morphos-button--ghost">Keep it</DialogClose>
            <button type="button" class="morphos-button btn-danger" onClick={() => { this.dialog.closeDialog(); }}>
              Yes, delete
            </button>
          </div>
        </DialogContent>
      </div>
    );
  }
}

// ---------------------------------------------------------------------------
// Form story — dialog containing a form
// ---------------------------------------------------------------------------

@Component()
class DialogFormDemo extends StatefulComponent {
  @State() dialog = new Dialog();

  onBeforeMount() {
    this.dialog.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:40px">
        <style>{SHARED_STYLES}</style>
        <DialogTrigger dialog={this.dialog} class="morphos-button morphos-button--outline">
          Edit profile
        </DialogTrigger>
        <DialogContent dialog={this.dialog} class="morphos-dialog-content" aria-labelledby="form-title" aria-describedby="form-desc">
          <DialogTitle id="form-title" class="morphos-dialog-title">Edit profile</DialogTitle>
          <DialogDescription id="form-desc" class="morphos-dialog-description">
            Update your display name and email address. Changes take effect immediately.
          </DialogDescription>
          <div class="form-field">
            <label for="dialog-name">Full name</label>
            <input id="dialog-name" type="text" class="morphos-input" placeholder="Full Name" />
          </div>
          <div class="form-field">
            <label for="dialog-email">Email address</label>
            <input id="dialog-email" type="email" class="morphos-input" placeholder="you@example.com" />
          </div>
          <div class="dialog-actions">
            <DialogClose dialog={this.dialog} class="morphos-button morphos-button--ghost">Cancel</DialogClose>
            <button type="button" class="morphos-button" onClick={() => { this.dialog.closeDialog(); }}>
              Save changes
            </button>
          </div>
        </DialogContent>
      </div>
    );
  }
}

// ---------------------------------------------------------------------------
// Meta + story exports
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: "Overlays/Dialog",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => <DialogDefaultDemo />,
};

export const Destructive: Story = {
  name: "Destructive",
  render: () => <DialogDestructiveDemo />,
};

export const Form: Story = {
  name: "Form",
  render: () => <DialogFormDemo />,
};
