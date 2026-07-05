import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@morphos/overlays";

// ---------------------------------------------------------------------------
// Default story — action menu
// ---------------------------------------------------------------------------

@Component()
class DropdownDefaultDemo extends StatefulComponent {
  @State() dropdown = new Dropdown();
  @State() selected = "";

  onBeforeMount() {
    this.dropdown.onBeforeMount?.();
    this.selected = "";
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:40px;display:flex;gap:32px;flex-wrap:wrap;align-items:flex-start">
        <div style="display:flex;flex-direction:column;gap:10px">
          <span style="font-size:0.6875rem;color:var(--morphos-color-text-muted);text-transform:uppercase;letter-spacing:0.05em;font-weight:600">Action menu</span>
          <DropdownTrigger dropdown={this.dropdown} class="morphos-button morphos-button--outline morphos-dropdown-trigger">
            Actions
          </DropdownTrigger>
          <DropdownMenu dropdown={this.dropdown} class="morphos-dropdown-menu">
            <DropdownItem dropdown={this.dropdown} value="edit" class="morphos-dropdown-item"
              onSelect={() => { this.selected = "edit"; }}>
              Edit
            </DropdownItem>
            <DropdownItem dropdown={this.dropdown} value="duplicate" class="morphos-dropdown-item"
              onSelect={() => { this.selected = "duplicate"; }}>
              Duplicate
            </DropdownItem>
            <div style="height:1px;background:var(--morphos-color-border);margin:4px 0" />
            <DropdownItem dropdown={this.dropdown} value="delete" class="morphos-dropdown-item morphos-dropdown-item--danger"
              onSelect={() => { this.selected = "delete"; }}>
              Delete
            </DropdownItem>
          </DropdownMenu>
          {() => this.selected && (
            <span style="display:inline-flex;align-items:center;padding:3px 10px;background:var(--morphos-color-bg-hover);color:var(--morphos-color-accent);border-radius:20px;font-size:0.75rem;font-weight:500">Selected: {this.selected}</span>
          )}
        </div>
      </div>
    );
  }
}

// ---------------------------------------------------------------------------
// WithIcons story — items with emoji prefix
// ---------------------------------------------------------------------------

@Component()
class DropdownWithIconsDemo extends StatefulComponent {
  @State() dropdown = new Dropdown();
  @State() selected = "";

  onBeforeMount() {
    this.dropdown.onBeforeMount?.();
    this.selected = "";
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:40px;display:flex;gap:32px;flex-wrap:wrap;align-items:flex-start">
        <div style="display:flex;flex-direction:column;gap:10px">
          <span style="font-size:0.6875rem;color:var(--morphos-color-text-muted);text-transform:uppercase;letter-spacing:0.05em;font-weight:600">With icons</span>
          <DropdownTrigger dropdown={this.dropdown} class="morphos-button morphos-button--outline morphos-dropdown-trigger">
            Options
          </DropdownTrigger>
          <DropdownMenu dropdown={this.dropdown} class="morphos-dropdown-menu">
            <DropdownItem dropdown={this.dropdown} value="edit" class="morphos-dropdown-item"
              onSelect={() => { this.selected = "edit"; }}>
              ✏️ Edit
            </DropdownItem>
            <DropdownItem dropdown={this.dropdown} value="copy" class="morphos-dropdown-item"
              onSelect={() => { this.selected = "copy"; }}>
              📋 Copy link
            </DropdownItem>
            <DropdownItem dropdown={this.dropdown} value="share" class="morphos-dropdown-item"
              onSelect={() => { this.selected = "share"; }}>
              🔗 Share
            </DropdownItem>
            <DropdownItem dropdown={this.dropdown} value="download" class="morphos-dropdown-item"
              onSelect={() => { this.selected = "download"; }}>
              ⬇️ Download
            </DropdownItem>
            <div style="height:1px;background:var(--morphos-color-border);margin:4px 0" />
            <DropdownItem dropdown={this.dropdown} value="archive" class="morphos-dropdown-item"
              onSelect={() => { this.selected = "archive"; }}>
              📦 Archive
            </DropdownItem>
            <DropdownItem dropdown={this.dropdown} value="delete" class="morphos-dropdown-item morphos-dropdown-item--danger"
              onSelect={() => { this.selected = "delete"; }}>
              🗑️ Delete
            </DropdownItem>
          </DropdownMenu>
          {() => this.selected && (
            <span style="display:inline-flex;align-items:center;padding:3px 10px;background:var(--morphos-color-bg-hover);color:var(--morphos-color-accent);border-radius:20px;font-size:0.75rem;font-weight:500">Selected: {this.selected}</span>
          )}
        </div>
      </div>
    );
  }
}

// ---------------------------------------------------------------------------
// Disabled story — items with aria-disabled
// ---------------------------------------------------------------------------

@Component()
class DropdownDisabledDemo extends StatefulComponent {
  @State() dropdown = new Dropdown();
  @State() selected = "";

  onBeforeMount() {
    this.dropdown.onBeforeMount?.();
    this.selected = "";
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:40px;display:flex;gap:32px;flex-wrap:wrap;align-items:flex-start">
        <div style="display:flex;flex-direction:column;gap:10px">
          <span style="font-size:0.6875rem;color:var(--morphos-color-text-muted);text-transform:uppercase;letter-spacing:0.05em;font-weight:600">With disabled items</span>
          <DropdownTrigger dropdown={this.dropdown} class="morphos-button morphos-button--outline morphos-dropdown-trigger">
            More
          </DropdownTrigger>
          <DropdownMenu dropdown={this.dropdown} class="morphos-dropdown-menu">
            <DropdownItem dropdown={this.dropdown} value="view" class="morphos-dropdown-item"
              onSelect={() => { this.selected = "view"; }}>
              View details
            </DropdownItem>
            <DropdownItem dropdown={this.dropdown} value="edit" class="morphos-dropdown-item"
              onSelect={() => { this.selected = "edit"; }}>
              Edit
            </DropdownItem>
            <DropdownItem dropdown={this.dropdown} value="export" class="morphos-dropdown-item" disabled
              onSelect={() => { this.selected = "export"; }}>
              Export (unavailable)
            </DropdownItem>
            <div style="height:1px;background:var(--morphos-color-border);margin:4px 0" />
            <DropdownItem dropdown={this.dropdown} value="transfer" class="morphos-dropdown-item" disabled
              onSelect={() => { this.selected = "transfer"; }}>
              Transfer ownership (Pro)
            </DropdownItem>
            <DropdownItem dropdown={this.dropdown} value="delete" class="morphos-dropdown-item morphos-dropdown-item--danger"
              onSelect={() => { this.selected = "delete"; }}>
              Delete
            </DropdownItem>
          </DropdownMenu>
          {() => this.selected && (
            <span style="display:inline-flex;align-items:center;padding:3px 10px;background:var(--morphos-color-bg-hover);color:var(--morphos-color-accent);border-radius:20px;font-size:0.75rem;font-weight:500">Selected: {this.selected}</span>
          )}
        </div>
      </div>
    );
  }
}

// ---------------------------------------------------------------------------
// Meta + story exports
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: "Overlays/Dropdown",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => <DropdownDefaultDemo />,
};

export const WithIcons: Story = {
  name: "With Icons",
  render: () => <DropdownWithIconsDemo />,
};

export const Disabled: Story = {
  name: "Disabled Items",
  render: () => <DropdownDisabledDemo />,
};
