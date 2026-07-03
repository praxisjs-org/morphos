import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@morphos/layout";

const NAV_STYLE = `
  .nav-root { background:#fff;border-bottom:1px solid #e5e7eb;padding:0 20px; }
  .demo-label {
    font-size:11px;color:#9ca3af;text-transform:uppercase;
    letter-spacing:.06em;margin:0 0 14px;font-family:sans-serif;
  }
`;

// ---------- Default (site nav with submenus) ----------

@Component()
class SiteNavDemo extends StatefulComponent {
  @State() nav = new NavigationMenu();
  @State() productsItem = new NavigationMenuItem({ nav: this.nav, value: "products" });
  @State() resourcesItem = new NavigationMenuItem({ nav: this.nav, value: "resources" });

  onBeforeMount() {
    this.nav.onBeforeMount?.();
    this.productsItem.onBeforeMount?.();
    this.resourcesItem.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:32px">
        <style>{NAV_STYLE}</style>
        <p class="demo-label">Click a trigger to open its submenu</p>
        <NavigationMenu aria-label="Main navigation" class="morphos-navigation-menu nav-root">
          <NavigationMenuList nav={this.nav} class="morphos-navigation-menu-list">
            <NavigationMenuItem nav={this.nav} value="products" class="morphos-navigation-menu-item">
              <NavigationMenuTrigger item={this.productsItem} class="morphos-navigation-menu-trigger">
                Products ▾
              </NavigationMenuTrigger>
              <NavigationMenuContent item={this.productsItem} class="morphos-navigation-menu-content">
                <NavigationMenuLink href="#" onClick={(e: MouseEvent) => { e.preventDefault(); }} class="morphos-navigation-menu-link">
                  <strong>Analytics</strong>
                  <span>Insights and reporting for your team</span>
                </NavigationMenuLink>
                <NavigationMenuLink href="#" onClick={(e: MouseEvent) => { e.preventDefault(); }} class="morphos-navigation-menu-link">
                  <strong>Automation</strong>
                  <span>Workflow automation at scale</span>
                </NavigationMenuLink>
                <NavigationMenuLink href="#" onClick={(e: MouseEvent) => { e.preventDefault(); }} class="morphos-navigation-menu-link">
                  <strong>Security</strong>
                  <span>Enterprise-grade access controls</span>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem nav={this.nav} value="resources" class="morphos-navigation-menu-item">
              <NavigationMenuTrigger item={this.resourcesItem} class="morphos-navigation-menu-trigger">
                Resources ▾
              </NavigationMenuTrigger>
              <NavigationMenuContent item={this.resourcesItem} class="morphos-navigation-menu-content">
                <NavigationMenuLink href="#" onClick={(e: MouseEvent) => { e.preventDefault(); }} class="morphos-navigation-menu-link">
                  <strong>Documentation</strong>
                  <span>Guides and API reference</span>
                </NavigationMenuLink>
                <NavigationMenuLink href="#" onClick={(e: MouseEvent) => { e.preventDefault(); }} class="morphos-navigation-menu-link">
                  <strong>Blog</strong>
                  <span>Updates, tutorials, and news</span>
                </NavigationMenuLink>
                <NavigationMenuLink href="#" onClick={(e: MouseEvent) => { e.preventDefault(); }} class="morphos-navigation-menu-link">
                  <strong>Community</strong>
                  <span>Forum and Discord</span>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <li><NavigationMenuLink href="#" onClick={(e: MouseEvent) => { e.preventDefault(); }} class="morphos-navigation-menu-link nav-bare">Pricing</NavigationMenuLink></li>
            <li><NavigationMenuLink href="#" onClick={(e: MouseEvent) => { e.preventDefault(); }} class="morphos-navigation-menu-link nav-bare">About</NavigationMenuLink></li>
          </NavigationMenuList>
        </NavigationMenu>
        <p style="margin:16px 0 0;font-size:12px;font-family:monospace;color:#9ca3af">
          Click outside or press Escape to close the active submenu.
        </p>
      </div>
    );
  }
}

// ---------- Flat nav (links only) ----------

@Component()
class FlatNavDemo extends StatefulComponent {
  @State() nav = new NavigationMenu();

  onBeforeMount() {
    this.nav.onBeforeMount?.();
  }

  render() {
    const links = ["Home", "Features", "Pricing", "Blog", "About"];
    return (
      <div style="font-family:sans-serif;padding:32px">
        <style>{NAV_STYLE}</style>
        <p class="demo-label">Flat navigation — links only</p>
        <NavigationMenu aria-label="Simple navigation" class="morphos-navigation-menu nav-root">
          <NavigationMenuList nav={this.nav} class="morphos-navigation-menu-list">
            {links.map((label) => (
              <li key={label}>
                <NavigationMenuLink href="#" onClick={(e: MouseEvent) => { e.preventDefault(); }} class="morphos-navigation-menu-link nav-bare">{label}</NavigationMenuLink>
              </li>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <p style="margin:16px 0 0;font-size:12px;font-family:monospace;color:#9ca3af">
          NavigationMenuLink renders a semantic anchor with aria-current support.
        </p>
      </div>
    );
  }
}

// ---------- Multi-section submenu ----------

@Component()
class MultiSectionDemo extends StatefulComponent {
  @State() nav = new NavigationMenu();
  @State() platformItem = new NavigationMenuItem({ nav: this.nav, value: "platform" });
  @State() companyItem = new NavigationMenuItem({ nav: this.nav, value: "company" });

  onBeforeMount() {
    this.nav.onBeforeMount?.();
    this.platformItem.onBeforeMount?.();
    this.companyItem.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:32px">
        <style>{NAV_STYLE + `
          .nav-grid { display:grid;grid-template-columns:1fr 1fr;gap:4px;min-width:380px; }
          .nav-section-title { font-size:.7rem;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;padding:4px 12px 6px; }
          .nav-divider { height:1px;background:#f3f4f6;margin:4px 0; }
        `}</style>
        <p class="demo-label">Multi-section submenu with grid layout</p>
        <NavigationMenu aria-label="Product navigation" class="morphos-navigation-menu nav-root">
          <NavigationMenuList nav={this.nav} class="morphos-navigation-menu-list">
            <NavigationMenuItem nav={this.nav} value="platform" class="morphos-navigation-menu-item">
              <NavigationMenuTrigger item={this.platformItem} class="morphos-navigation-menu-trigger">
                Platform ▾
              </NavigationMenuTrigger>
              <NavigationMenuContent item={this.platformItem} class="morphos-navigation-menu-content">
                <p class="nav-section-title">Core</p>
                <div class="nav-grid">
                  <NavigationMenuLink href="#" onClick={(e: MouseEvent) => { e.preventDefault(); }} class="morphos-navigation-menu-link">
                    <strong>Dashboard</strong>
                    <span>Overview of your workspace</span>
                  </NavigationMenuLink>
                  <NavigationMenuLink href="#" onClick={(e: MouseEvent) => { e.preventDefault(); }} class="morphos-navigation-menu-link">
                    <strong>Analytics</strong>
                    <span>Metrics and insights</span>
                  </NavigationMenuLink>
                  <NavigationMenuLink href="#" onClick={(e: MouseEvent) => { e.preventDefault(); }} class="morphos-navigation-menu-link">
                    <strong>Integrations</strong>
                    <span>Connect your tools</span>
                  </NavigationMenuLink>
                  <NavigationMenuLink href="#" onClick={(e: MouseEvent) => { e.preventDefault(); }} class="morphos-navigation-menu-link">
                    <strong>API</strong>
                    <span>REST and GraphQL APIs</span>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem nav={this.nav} value="company" class="morphos-navigation-menu-item">
              <NavigationMenuTrigger item={this.companyItem} class="morphos-navigation-menu-trigger">
                Company ▾
              </NavigationMenuTrigger>
              <NavigationMenuContent item={this.companyItem} class="morphos-navigation-menu-content">
                <NavigationMenuLink href="#" onClick={(e: MouseEvent) => { e.preventDefault(); }} class="morphos-navigation-menu-link">
                  <strong>About us</strong>
                  <span>Our mission and values</span>
                </NavigationMenuLink>
                <NavigationMenuLink href="#" onClick={(e: MouseEvent) => { e.preventDefault(); }} class="morphos-navigation-menu-link">
                  <strong>Careers</strong>
                  <span>Join the team</span>
                </NavigationMenuLink>
                <div class="nav-divider" />
                <NavigationMenuLink href="#" onClick={(e: MouseEvent) => { e.preventDefault(); }} class="morphos-navigation-menu-link">
                  <strong>Press</strong>
                  <span>News and media</span>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <li><NavigationMenuLink href="#" onClick={(e: MouseEvent) => { e.preventDefault(); }} class="morphos-navigation-menu-link nav-bare">Docs</NavigationMenuLink></li>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    );
  }
}

// ---------- Meta ----------

const meta: Meta = {
  title: "Layout/NavigationMenu",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Site navigation bar with optional dropdown submenus. Uses a compound component pattern: each `NavigationMenuItem` receives the root `NavigationMenu` instance to share active-item state. Styled here with the `@morphos/styles` `morphos-navigation-menu` recipe.",
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default — site nav with submenus",
  render: () => <SiteNavDemo />,
};

export const FlatNav: Story = {
  name: "Flat Navigation — links only",
  render: () => <FlatNavDemo />,
};

export const MultiSection: Story = {
  name: "Multi-section submenu",
  render: () => <MultiSectionDemo />,
};
