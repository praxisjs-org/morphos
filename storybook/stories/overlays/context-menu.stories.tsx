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

// .ctx-zone[data-open]/:hover is tied to real component state, and
// ContextMenuTrigger only accepts `class` (not `style`) — kept as a small
// scoped stylesheet. The danger item variant now comes from
// @morphos/styles' `morphos-context-menu-item--danger`.
const SHARED_STYLES = `
  .ctx-zone {
    border: 2px dashed var(--morphos-color-border);
    border-radius: 10px;
    padding: 48px 24px;
    text-align: center;
    cursor: context-menu;
    user-select: none;
    transition: border-color 0.15s, background 0.15s;
  }
  .ctx-zone:hover {
    border-color: var(--morphos-color-accent);
    background: var(--morphos-color-bg-hover);
  }
  .ctx-zone[data-open] {
    border-color: var(--morphos-color-accent);
    background: var(--morphos-color-bg-hover);
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
      <div style="font-family:sans-serif;padding:40px">
        <style>{SHARED_STYLES}</style>
        <p style="font-size:0.6875rem;color:var(--morphos-color-text-muted);text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:6px">Canvas area</p>
        <ContextMenuTrigger contextMenu={this.menu} class="ctx-zone">
          <span style="font-size:36px;display:block;margin-bottom:10px">🖼️</span>
          <p style="font-size:0.875rem;color:var(--morphos-color-text-muted);margin:0">
            <strong style="color:var(--morphos-color-text-muted)">Right-click</strong> anywhere in this zone
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
          <div style="height:1px;background:var(--morphos-color-border);margin:4px 0" />
          <ContextMenuItem contextMenu={this.menu} value="delete" class="morphos-context-menu-item morphos-context-menu-item--danger"
            onSelect={() => { this.lastAction = "delete"; }}>
            🗑️ Delete
          </ContextMenuItem>
        </ContextMenuContent>

        {() => this.lastAction && (
          <p style="display:inline-flex;align-items:center;gap:6px;margin-top:16px;padding:6px 14px;background:var(--morphos-color-bg-hover);color:var(--morphos-color-accent);border-radius:20px;font-size:0.75rem;font-weight:500">Last action: {this.lastAction}</p>
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
      <div style="font-family:sans-serif;padding:40px">
        <style>{SHARED_STYLES}</style>
        <p style="font-size:0.6875rem;color:var(--morphos-color-text-muted);text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:6px">Image asset</p>
        <ContextMenuTrigger contextMenu={this.menu}>
          <div style="width:280px;height:180px;border-radius:10px;background:linear-gradient(135deg, #667eea, #764ba2);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:context-menu;user-select:none;font-size:2.5rem">
            🌄
            <span style="font-size:0.75rem;color:rgba(255,255,255,0.8);font-family:sans-serif">Right-click for options</span>
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
          <div style="height:1px;background:var(--morphos-color-border);margin:4px 0" />
          <ContextMenuItem contextMenu={this.menu} value="replace" class="morphos-context-menu-item"
            onSelect={() => { this.lastAction = "replace image"; }}>
            🔄 Replace image
          </ContextMenuItem>
          <ContextMenuItem contextMenu={this.menu} value="delete" class="morphos-context-menu-item morphos-context-menu-item--danger"
            onSelect={() => { this.lastAction = "delete image"; }}>
            🗑️ Remove image
          </ContextMenuItem>
        </ContextMenuContent>

        {() => this.lastAction && (
          <p style="display:inline-flex;align-items:center;gap:6px;margin-top:16px;padding:6px 14px;background:var(--morphos-color-bg-hover);color:var(--morphos-color-accent);border-radius:20px;font-size:0.75rem;font-weight:500">Last action: {this.lastAction}</p>
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
