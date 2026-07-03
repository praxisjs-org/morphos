import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@morphos/overlays";

// ---------------------------------------------------------------------------
// Shared styles — layout/demo-only rules not covered by @morphos/styles.
// Backdrop, panel positioning/slide-in, and the close button all come from
// the `morphos-drawer-content`/`[data-morphos-backdrop]` recipe now.
// ---------------------------------------------------------------------------

const SHARED_STYLES = `
  .drawer-handle {
    width: 40px; height: 4px;
    background: #d1d5db;
    border-radius: 2px;
    margin: 12px auto 0;
    flex-shrink: 0;
  }
  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 16px;
    border-bottom: 1px solid #f3f4f6;
    flex-shrink: 0;
  }
  .drawer-body {
    flex: 1;
    overflow-y: auto;
    padding-top: 16px;
  }
  .nav-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    font-size: 0.875rem;
    color: #374151;
    border-bottom: 1px solid #f9fafb;
    cursor: pointer;
  }
  .nav-row:hover { color: #4f46e5; }
  .nav-icon {
    width: 32px; height: 32px;
    border-radius: 6px;
    background: #eef2ff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    flex-shrink: 0;
  }
  .setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    font-size: 0.875rem;
    color: #374151;
    border-bottom: 1px solid #f9fafb;
  }
  .setting-label { font-weight: 500; }
  .setting-hint { font-size: 0.75rem; color: #9ca3af; }
  .toggle {
    width: 40px; height: 22px;
    background: #4f46e5;
    border-radius: 11px;
    position: relative;
    cursor: pointer;
    flex-shrink: 0;
  }
  .toggle::after {
    content: "";
    width: 16px; height: 16px;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    top: 3px; right: 3px;
  }
  .share-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    font-size: 0.875rem;
    color: #374151;
    cursor: pointer;
    border-bottom: 1px solid #f9fafb;
  }
  .share-row:hover { color: #4f46e5; }
  .share-icon {
    width: 36px; height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }
`;

// ---------------------------------------------------------------------------
// Right drawer story — settings panel
// ---------------------------------------------------------------------------

@Component()
class DrawerRightDemo extends StatefulComponent {
  @State() drawer = new Drawer({ side: "right" });

  onBeforeMount() {
    this.drawer.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:40px">
        <style>{SHARED_STYLES}</style>
        <DrawerTrigger drawer={this.drawer} class="morphos-button morphos-button--outline">
          Open settings
        </DrawerTrigger>

        <DrawerContent drawer={this.drawer} class="morphos-drawer-content" aria-labelledby="drawer-right-title">
          <div class="drawer-header">
            <DrawerTitle id="drawer-right-title" class="morphos-drawer-title">Settings</DrawerTitle>
            <DrawerClose drawer={this.drawer} class="morphos-drawer-close">✕</DrawerClose>
          </div>
          <DrawerDescription class="morphos-drawer-description">
            Manage your account and application preferences.
          </DrawerDescription>
          <div class="drawer-body">
            {[
              { label: "Email notifications", hint: "Receive updates by email" },
              { label: "Two-factor auth", hint: "Add an extra layer of security" },
              { label: "Public profile", hint: "Make your profile discoverable" },
            ].map((s) => (
              <div class="setting-row" key={s.label}>
                <div>
                  <p class="setting-label" style="margin:0">{s.label}</p>
                  <p class="setting-hint" style="margin:2px 0 0">{s.hint}</p>
                </div>
                <div class="toggle" />
              </div>
            ))}
            {[
              "Profile",
              "Billing",
              "API Keys",
              "Integrations",
              "Privacy",
              "Help & Support",
            ].map((item) => (
              <div class="nav-row" key={item}>
                <div class="nav-icon">⚙️</div>
                {item}
              </div>
            ))}
          </div>
        </DrawerContent>
      </div>
    );
  }
}

// ---------------------------------------------------------------------------
// Bottom drawer story — share sheet
// ---------------------------------------------------------------------------

@Component()
class DrawerBottomDemo extends StatefulComponent {
  @State() drawer = new Drawer({ side: "bottom" });

  onBeforeMount() {
    this.drawer.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:40px">
        <style>{SHARED_STYLES}</style>
        <DrawerTrigger drawer={this.drawer} class="morphos-button morphos-button--outline">
          Share this page
        </DrawerTrigger>

        <DrawerContent drawer={this.drawer} class="morphos-drawer-content" aria-labelledby="drawer-bottom-title">
          <div class="drawer-handle" />
          <div class="drawer-header">
            <DrawerTitle id="drawer-bottom-title" class="morphos-drawer-title">Share</DrawerTitle>
            <DrawerClose drawer={this.drawer} class="morphos-drawer-close">✕</DrawerClose>
          </div>
          <DrawerDescription class="morphos-drawer-description">
            Choose how you would like to share this page.
          </DrawerDescription>
          <div class="drawer-body">
            {[
              { icon: "🔗", label: "Copy link", hint: "Share a direct URL" },
              { icon: "📧", label: "Send by email", hint: "Invite via email address" },
              { icon: "🐦", label: "Twitter / X", hint: "Post to your timeline" },
              { icon: "💬", label: "Slack", hint: "Send to a channel or DM" },
            ].map((s) => (
              <div class="share-row" key={s.label}>
                <div class="share-icon" style="background:#f3f4f6">{s.icon}</div>
                <div>
                  <p style="margin:0;font-weight:500">{s.label}</p>
                  <p style="margin:2px 0 0;font-size:0.75rem;color:#9ca3af">{s.hint}</p>
                </div>
              </div>
            ))}
          </div>
        </DrawerContent>
      </div>
    );
  }
}

// ---------------------------------------------------------------------------
// Left drawer story — navigation drawer
// ---------------------------------------------------------------------------

@Component()
class DrawerLeftDemo extends StatefulComponent {
  @State() drawer = new Drawer({ side: "left" });

  onBeforeMount() {
    this.drawer.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:40px">
        <style>{SHARED_STYLES}</style>
        <DrawerTrigger drawer={this.drawer} class="morphos-button morphos-button--outline">
          Open navigation
        </DrawerTrigger>

        <DrawerContent drawer={this.drawer} class="morphos-drawer-content" aria-labelledby="drawer-left-title">
          <div class="drawer-header">
            <DrawerTitle id="drawer-left-title" class="morphos-drawer-title">Navigation</DrawerTitle>
            <DrawerClose drawer={this.drawer} class="morphos-drawer-close">✕</DrawerClose>
          </div>
          <div class="drawer-body" style="padding-top:12px">
            {[
              { icon: "🏠", label: "Dashboard" },
              { icon: "📁", label: "Projects" },
              { icon: "✅", label: "Tasks" },
              { icon: "👥", label: "Team" },
              { icon: "📊", label: "Reports" },
              { icon: "❓", label: "Help" },
            ].map((item) => (
              <div class="nav-row" key={item.label}>
                <div class="nav-icon">{item.icon}</div>
                {item.label}
              </div>
            ))}
          </div>
        </DrawerContent>
      </div>
    );
  }
}

// ---------------------------------------------------------------------------
// Meta + story exports
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: "Overlays/Drawer",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

export const Right: Story = {
  name: "Right",
  render: () => <DrawerRightDemo />,
};

export const Bottom: Story = {
  name: "Bottom",
  render: () => <DrawerBottomDemo />,
};

export const Left: Story = {
  name: "Left",
  render: () => <DrawerLeftDemo />,
};
