import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@morphos/overlays";

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const SHARED_STYLES = `
  .ctx-zone {
    border: 2px dashed #d1d5db;
    border-radius: 10px;
    padding: 48px 24px;
    text-align: center;
    cursor: context-menu;
    user-select: none;
    transition: border-color 0.15s, background 0.15s;
  }
  .ctx-zone:hover {
    border-color: #a5b4fc;
    background: #fafafe;
  }
  .ctx-zone[data-open] {
    border-color: #4f46e5;
    background: #f5f3ff;
  }
  .ctx-zone-hint {
    font-size: 0.875rem;
    color: #9ca3af;
    margin: 0;
  }
  .ctx-zone-hint strong { color: #6b7280; }
  .ctx-item-danger { color: #dc2626; }
  .ctx-item-danger:hover, .ctx-item-danger:focus { background: #fef2f2; }
  .ctx-separator {
    height: 1px;
    background: #f3f4f6;
    margin: 4px 0;
  }
  .demo-wrapper {
    font-family: sans-serif;
    padding: 40px;
  }
  .action-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 16px;
    padding: 6px 14px;
    background: #eef2ff;
    color: #4f46e5;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  .zone-label {
    font-size: 0.6875rem;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
    margin-bottom: 6px;
  }
  .zone-icon {
    font-size: 36px;
    display: block;
    margin-bottom: 10px;
  }
`;

// ---------------------------------------------------------------------------
// Default story — right-click on a card area
// ---------------------------------------------------------------------------

@Component()
class ContextMenuDefaultDemo extends StatefulComponent {
  @State() menu = new ContextMenu();
  @State() lastAction = "";

  onBeforeMount() {
    this.menu.onBeforeMount?.();
    this.lastAction = "";
  }

  render() {
    return (
      <div class="demo-wrapper">
        <style>{SHARED_STYLES}</style>
        <p class="zone-label">Canvas area</p>
        <ContextMenuTrigger contextMenu={this.menu} class="ctx-zone">
          <span class="zone-icon">🖼️</span>
          <p class="ctx-zone-hint">
            <strong>Right-click</strong> anywhere in this zone
          </p>
        </ContextMenuTrigger>

        <ContextMenuContent contextMenu={this.menu} class="morphos-context-menu-content" aria-label="Canvas actions">
          <ContextMenuItem contextMenu={this.menu} value="copy" class="morphos-context-menu-item"
            onSelect={() => { this.lastAction = "copy"; }}>
            📋 Copy
          </ContextMenuItem>
          <ContextMenuItem contextMenu={this.menu} value="cut" class="morphos-context-menu-item"
            onSelect={() => { this.lastAction = "cut"; }}>
            ✂️ Cut
          </ContextMenuItem>
          <ContextMenuItem contextMenu={this.menu} value="paste" class="morphos-context-menu-item"
            onSelect={() => { this.lastAction = "paste"; }}>
            📌 Paste
          </ContextMenuItem>
          <div class="ctx-separator" />
          <ContextMenuItem contextMenu={this.menu} value="delete" class="morphos-context-menu-item ctx-item-danger"
            onSelect={() => { this.lastAction = "delete"; }}>
            🗑️ Delete
          </ContextMenuItem>
        </ContextMenuContent>

        {() => this.lastAction && (
          <p class="action-pill">Last action: {this.lastAction}</p>
        )}
      </div>
    );
  }
}

// ---------------------------------------------------------------------------
// CustomTrigger story — right-click on an image placeholder
// ---------------------------------------------------------------------------

@Component()
class ContextMenuCustomTriggerDemo extends StatefulComponent {
  @State() menu = new ContextMenu();
  @State() lastAction = "";

  onBeforeMount() {
    this.menu.onBeforeMount?.();
    this.lastAction = "";
  }

  render() {
    return (
      <div class="demo-wrapper">
        <style>{SHARED_STYLES}{`
          .img-placeholder {
            width: 280px;
            height: 180px;
            border-radius: 10px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 8px;
            cursor: context-menu;
            user-select: none;
            font-size: 2.5rem;
          }
          .img-caption {
            font-size: 0.75rem;
            color: rgba(255,255,255,0.8);
            font-family: sans-serif;
          }
        `}</style>
        <p class="zone-label">Image asset</p>
        <ContextMenuTrigger contextMenu={this.menu}>
          <div class="img-placeholder">
            🌄
            <span class="img-caption">Right-click for options</span>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent contextMenu={this.menu} class="morphos-context-menu-content" aria-label="Image actions">
          <ContextMenuItem contextMenu={this.menu} value="view" class="morphos-context-menu-item"
            onSelect={() => { this.lastAction = "view full size"; }}>
            🔍 View full size
          </ContextMenuItem>
          <ContextMenuItem contextMenu={this.menu} value="copy-url" class="morphos-context-menu-item"
            onSelect={() => { this.lastAction = "copy URL"; }}>
            🔗 Copy URL
          </ContextMenuItem>
          <ContextMenuItem contextMenu={this.menu} value="download" class="morphos-context-menu-item"
            onSelect={() => { this.lastAction = "download"; }}>
            ⬇️ Download
          </ContextMenuItem>
          <div class="ctx-separator" />
          <ContextMenuItem contextMenu={this.menu} value="replace" class="morphos-context-menu-item"
            onSelect={() => { this.lastAction = "replace image"; }}>
            🔄 Replace image
          </ContextMenuItem>
          <ContextMenuItem contextMenu={this.menu} value="delete" class="morphos-context-menu-item ctx-item-danger"
            onSelect={() => { this.lastAction = "delete image"; }}>
            🗑️ Remove image
          </ContextMenuItem>
        </ContextMenuContent>

        {() => this.lastAction && (
          <p class="action-pill">Last action: {this.lastAction}</p>
        )}
      </div>
    );
  }
}

// ---------------------------------------------------------------------------
// Meta + story exports
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: "Overlays/ContextMenu",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => <ContextMenuDefaultDemo />,
};

export const CustomTrigger: Story = {
  name: "Custom Trigger",
  render: () => <ContextMenuCustomTriggerDemo />,
};
