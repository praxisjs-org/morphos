import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@morphos/layout";

// ---------- Default story ----------

@Component()
class MenubarDefaultDemo extends StatefulComponent {
  @State() menubar = new Menubar({ "aria-label": "Application menu" });
  @State() fileMenu = new MenubarMenu({ menubar: this.menubar, value: "file" });
  @State() editMenu = new MenubarMenu({ menubar: this.menubar, value: "edit" });
  @State() viewMenu = new MenubarMenu({ menubar: this.menubar, value: "view" });
  @State() lastAction = "";

  onBeforeMount() {
    this.menubar.onBeforeMount?.();
    this.fileMenu.onBeforeMount?.();
    this.editMenu.onBeforeMount?.();
    this.viewMenu.onBeforeMount?.();
    this.lastAction = "";
  }

  act(label: string) {
    this.lastAction = label;
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:32px">
        <p style="font-size:13px;color:var(--morphos-color-text-muted);margin:0 0 16px">
          Click a menu label to open it. Opening a new menu automatically closes the previous one.
          Press Escape to close the active menu.
        </p>

        <Menubar class="morphos-menubar" aria-label="Application menu">
          {/* File */}
          <MenubarMenu menubar={this.menubar} value="file">
            <MenubarTrigger menu={this.fileMenu} class="morphos-menubar-trigger">File</MenubarTrigger>
            <MenubarContent menu={this.fileMenu} class="morphos-menubar-content">
              <MenubarItem menu={this.fileMenu} label="New File" class="morphos-menubar-item" onSelect={() => { this.act("New File"); }}>
                New File
                <span style="font-size:11px;color:var(--morphos-color-text-muted);font-family:monospace">Ctrl N</span>
              </MenubarItem>
              <MenubarItem menu={this.fileMenu} label="Open…" class="morphos-menubar-item" onSelect={() => { this.act("Open"); }}>
                Open…
                <span style="font-size:11px;color:var(--morphos-color-text-muted);font-family:monospace">Ctrl O</span>
              </MenubarItem>
              <MenubarItem menu={this.fileMenu} label="Open Recent" class="morphos-menubar-item" onSelect={() => { this.act("Open Recent"); }}>
                Open Recent
              </MenubarItem>
              <MenubarSeparator class="morphos-menubar-separator" />
              <MenubarItem menu={this.fileMenu} label="Save" class="morphos-menubar-item" onSelect={() => { this.act("Save"); }}>
                Save
                <span style="font-size:11px;color:var(--morphos-color-text-muted);font-family:monospace">Ctrl S</span>
              </MenubarItem>
              <MenubarItem menu={this.fileMenu} label="Save As…" class="morphos-menubar-item" onSelect={() => { this.act("Save As"); }}>
                Save As…
                <span style="font-size:11px;color:var(--morphos-color-text-muted);font-family:monospace">Ctrl Shift S</span>
              </MenubarItem>
              <MenubarSeparator class="morphos-menubar-separator" />
              <MenubarItem menu={this.fileMenu} label="Close" class="morphos-menubar-item" onSelect={() => { this.act("Close"); }}>
                Close
                <span style="font-size:11px;color:var(--morphos-color-text-muted);font-family:monospace">Ctrl W</span>
              </MenubarItem>
              <MenubarItem menu={this.fileMenu} label="Quit" class="morphos-menubar-item" onSelect={() => { this.act("Quit"); }}>
                Quit
                <span style="font-size:11px;color:var(--morphos-color-text-muted);font-family:monospace">Ctrl Q</span>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          {/* Edit */}
          <MenubarMenu menubar={this.menubar} value="edit">
            <MenubarTrigger menu={this.editMenu} class="morphos-menubar-trigger">Edit</MenubarTrigger>
            <MenubarContent menu={this.editMenu} class="morphos-menubar-content">
              <MenubarItem menu={this.editMenu} label="Undo" class="morphos-menubar-item" onSelect={() => { this.act("Undo"); }}>
                Undo
                <span style="font-size:11px;color:var(--morphos-color-text-muted);font-family:monospace">Ctrl Z</span>
              </MenubarItem>
              <MenubarItem menu={this.editMenu} label="Redo" class="morphos-menubar-item" onSelect={() => { this.act("Redo"); }}>
                Redo
                <span style="font-size:11px;color:var(--morphos-color-text-muted);font-family:monospace">Ctrl Shift Z</span>
              </MenubarItem>
              <MenubarSeparator class="morphos-menubar-separator" />
              <MenubarItem menu={this.editMenu} label="Cut" class="morphos-menubar-item" onSelect={() => { this.act("Cut"); }}>
                Cut
                <span style="font-size:11px;color:var(--morphos-color-text-muted);font-family:monospace">Ctrl X</span>
              </MenubarItem>
              <MenubarItem menu={this.editMenu} label="Copy" class="morphos-menubar-item" onSelect={() => { this.act("Copy"); }}>
                Copy
                <span style="font-size:11px;color:var(--morphos-color-text-muted);font-family:monospace">Ctrl C</span>
              </MenubarItem>
              <MenubarItem menu={this.editMenu} label="Paste" class="morphos-menubar-item" onSelect={() => { this.act("Paste"); }}>
                Paste
                <span style="font-size:11px;color:var(--morphos-color-text-muted);font-family:monospace">Ctrl V</span>
              </MenubarItem>
              <MenubarSeparator class="morphos-menubar-separator" />
              <MenubarItem menu={this.editMenu} label="Find" class="morphos-menubar-item" disabled onSelect={() => { /* no-op */ }}>
                Find
                <span style="font-size:11px;color:var(--morphos-color-text-muted);font-family:monospace">Ctrl F</span>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          {/* View */}
          <MenubarMenu menubar={this.menubar} value="view">
            <MenubarTrigger menu={this.viewMenu} class="morphos-menubar-trigger">View</MenubarTrigger>
            <MenubarContent menu={this.viewMenu} class="morphos-menubar-content">
              <MenubarItem menu={this.viewMenu} label="Zoom In" class="morphos-menubar-item" onSelect={() => { this.act("Zoom In"); }}>
                Zoom In
                <span style="font-size:11px;color:var(--morphos-color-text-muted);font-family:monospace">Ctrl +</span>
              </MenubarItem>
              <MenubarItem menu={this.viewMenu} label="Zoom Out" class="morphos-menubar-item" onSelect={() => { this.act("Zoom Out"); }}>
                Zoom Out
                <span style="font-size:11px;color:var(--morphos-color-text-muted);font-family:monospace">Ctrl -</span>
              </MenubarItem>
              <MenubarItem menu={this.viewMenu} label="Reset Zoom" class="morphos-menubar-item" onSelect={() => { this.act("Reset Zoom"); }}>
                Reset Zoom
                <span style="font-size:11px;color:var(--morphos-color-text-muted);font-family:monospace">Ctrl 0</span>
              </MenubarItem>
              <MenubarSeparator class="morphos-menubar-separator" />
              <MenubarItem menu={this.viewMenu} label="Full Screen" class="morphos-menubar-item" onSelect={() => { this.act("Full Screen"); }}>
                Full Screen
                <span style="font-size:11px;color:var(--morphos-color-text-muted);font-family:monospace">F11</span>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        <div style="display:flex;align-items:center;gap:8px;margin-top:12px;padding:8px 12px;background:var(--morphos-color-bg-subtle);border:1px solid var(--morphos-color-border);border-radius:6px;font-size:12px;color:var(--morphos-color-text-muted);font-family:sans-serif;min-height:36px">
          {() =>
            this.lastAction
              ? <>Last action: <span style="font-weight:600;color:var(--morphos-color-text)">{this.lastAction}</span></>
              : "Select a menu item to see the action here."
          }
        </div>

        <div style="margin-top:14px;padding:10px 14px;background:var(--morphos-color-info-bg);border:1px solid var(--morphos-color-info);border-radius:6px;font-size:12px;color:var(--morphos-color-text);font-family:sans-serif">
          <strong>Compound pattern:</strong> Each <code>MenubarMenu</code> receives the shared
          <code> Menubar</code> instance — opening one menu calls <code>menubar.open(value)</code>
          which automatically closes others.
        </div>
      </div>
    );
  }
}

// ---------- Meta ----------

const meta: Meta = {
  title: "Layout/Menubar",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "An application-style menu bar with multiple drop-down menus. Each menu is a compound of MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, and MenubarSeparator sharing a root Menubar instance. Styled here with the `@morphos/styles` `morphos-menubar` recipe.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default — File / Edit / View",
  render: () => <MenubarDefaultDemo />,
};
