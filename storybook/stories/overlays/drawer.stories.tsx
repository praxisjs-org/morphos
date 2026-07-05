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

// :hover and ::after can't be expressed as inline styles on plain elements —
// kept as a small scoped stylesheet; everything else below is inlined.
const SHARED_STYLES = `
  .nav-row:hover { color: var(--morphos-color-accent); }
  .toggle::after {
    content: "";
    width: 16px; height: 16px;
    background: var(--morphos-color-accent-text);
    border-radius: 50%;
    position: absolute;
    top: 3px; right: 3px;
  }
  .share-row:hover { color: var(--morphos-color-accent); }
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
          <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:16px;border-bottom:1px solid var(--morphos-color-border);flex-shrink:0">
            <DrawerTitle id="drawer-right-title" class="morphos-drawer-title">Settings</DrawerTitle>
            <DrawerClose drawer={this.drawer} class="morphos-drawer-close">✕</DrawerClose>
          </div>
          <DrawerDescription class="morphos-drawer-description">
            Manage your account and application preferences.
          </DrawerDescription>
          <div style="flex:1;overflow-y:auto;padding-top:16px">
            {[
              { label: "Email notifications", hint: "Receive updates by email" },
              { label: "Two-factor auth", hint: "Add an extra layer of security" },
              { label: "Public profile", hint: "Make your profile discoverable" },
            ].map((s) => (
              <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;font-size:0.875rem;color:var(--morphos-color-text);border-bottom:1px solid var(--morphos-color-border)" key={s.label}>
                <div>
                  <p style="font-weight:500;margin:0">{s.label}</p>
                  <p style="font-size:0.75rem;color:var(--morphos-color-text-muted);margin:2px 0 0">{s.hint}</p>
                </div>
                <div class="toggle" style="width:40px;height:22px;background:var(--morphos-color-accent);border-radius:11px;position:relative;cursor:pointer;flex-shrink:0" />
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
              <div class="nav-row" style="display:flex;align-items:center;gap:12px;padding:10px 0;font-size:0.875rem;color:var(--morphos-color-text);border-bottom:1px solid var(--morphos-color-border);cursor:pointer" key={item}>
                <div style="width:32px;height:32px;border-radius:6px;background:var(--morphos-color-bg-hover);display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0">⚙️</div>
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
          <div style="width:40px;height:4px;background:var(--morphos-color-border);border-radius:2px;margin:12px auto 0;flex-shrink:0" />
          <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:16px;border-bottom:1px solid var(--morphos-color-border);flex-shrink:0">
            <DrawerTitle id="drawer-bottom-title" class="morphos-drawer-title">Share</DrawerTitle>
            <DrawerClose drawer={this.drawer} class="morphos-drawer-close">✕</DrawerClose>
          </div>
          <DrawerDescription class="morphos-drawer-description">
            Choose how you would like to share this page.
          </DrawerDescription>
          <div style="flex:1;overflow-y:auto;padding-top:16px">
            {[
              { icon: "🔗", label: "Copy link", hint: "Share a direct URL" },
              { icon: "📧", label: "Send by email", hint: "Invite via email address" },
              { icon: "🐦", label: "Twitter / X", hint: "Post to your timeline" },
              { icon: "💬", label: "Slack", hint: "Send to a channel or DM" },
            ].map((s) => (
              <div class="share-row" style="display:flex;align-items:center;gap:12px;padding:12px 0;font-size:0.875rem;color:var(--morphos-color-text);cursor:pointer;border-bottom:1px solid var(--morphos-color-border)" key={s.label}>
                <div style="width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;background:var(--morphos-color-bg-subtle)">{s.icon}</div>
                <div>
                  <p style="margin:0;font-weight:500">{s.label}</p>
                  <p style="margin:2px 0 0;font-size:0.75rem;color:var(--morphos-color-text-muted)">{s.hint}</p>
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
          <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:16px;border-bottom:1px solid var(--morphos-color-border);flex-shrink:0">
            <DrawerTitle id="drawer-left-title" class="morphos-drawer-title">Navigation</DrawerTitle>
            <DrawerClose drawer={this.drawer} class="morphos-drawer-close">✕</DrawerClose>
          </div>
          <div style="flex:1;overflow-y:auto;padding-top:12px">
            {[
              { icon: "🏠", label: "Dashboard" },
              { icon: "📁", label: "Projects" },
              { icon: "✅", label: "Tasks" },
              { icon: "👥", label: "Team" },
              { icon: "📊", label: "Reports" },
              { icon: "❓", label: "Help" },
            ].map((item) => (
              <div class="nav-row" style="display:flex;align-items:center;gap:12px;padding:10px 0;font-size:0.875rem;color:var(--morphos-color-text);border-bottom:1px solid var(--morphos-color-border);cursor:pointer" key={item.label}>
                <div style="width:32px;height:32px;border-radius:6px;background:var(--morphos-color-bg-hover);display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0">{item.icon}</div>
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
