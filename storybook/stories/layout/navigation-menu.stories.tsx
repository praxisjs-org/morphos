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
        <p style="font-size:11px;color:var(--morphos-color-text-muted);text-transform:uppercase;letter-spacing:.06em;margin:0 0 14px;font-family:sans-serif">Click a trigger to open its submenu</p>
        <div style="background:var(--morphos-color-bg);border-bottom:1px solid var(--morphos-color-border);padding:0 20px">
        <NavigationMenu aria-label="Main navigation" class="morphos-navigation-menu">
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

            <li><NavigationMenuLink href="#" onClick={(e: MouseEvent) => { e.preventDefault(); }} class="morphos-navigation-menu-link">Pricing</NavigationMenuLink></li>
            <li><NavigationMenuLink href="#" onClick={(e: MouseEvent) => { e.preventDefault(); }} class="morphos-navigation-menu-link">About</NavigationMenuLink></li>
          </NavigationMenuList>
        </NavigationMenu>
        </div>
        <p style="margin:16px 0 0;font-size:12px;font-family:monospace;color:var(--morphos-color-text-muted)">
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
        <p style="font-size:11px;color:var(--morphos-color-text-muted);text-transform:uppercase;letter-spacing:.06em;margin:0 0 14px;font-family:sans-serif">Flat navigation — links only</p>
        <div style="background:var(--morphos-color-bg);border-bottom:1px solid var(--morphos-color-border);padding:0 20px">
        <NavigationMenu aria-label="Simple navigation" class="morphos-navigation-menu">
          <NavigationMenuList nav={this.nav} class="morphos-navigation-menu-list">
            {links.map((label) => (
              <li key={label}>
                <NavigationMenuLink href="#" onClick={(e: MouseEvent) => { e.preventDefault(); }} class="morphos-navigation-menu-link">{label}</NavigationMenuLink>
              </li>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        </div>
        <p style="margin:16px 0 0;font-size:12px;font-family:monospace;color:var(--morphos-color-text-muted)">
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
        <p style="font-size:11px;color:var(--morphos-color-text-muted);text-transform:uppercase;letter-spacing:.06em;margin:0 0 14px;font-family:sans-serif">Multi-section submenu with grid layout</p>
        <div style="background:var(--morphos-color-bg);border-bottom:1px solid var(--morphos-color-border);padding:0 20px">
        <NavigationMenu aria-label="Product navigation" class="morphos-navigation-menu">
          <NavigationMenuList nav={this.nav} class="morphos-navigation-menu-list">
            <NavigationMenuItem nav={this.nav} value="platform" class="morphos-navigation-menu-item">
              <NavigationMenuTrigger item={this.platformItem} class="morphos-navigation-menu-trigger">
                Platform ▾
              </NavigationMenuTrigger>
              <NavigationMenuContent item={this.platformItem} class="morphos-navigation-menu-content">
                <p style="font-size:.7rem;font-weight:600;color:var(--morphos-color-text-muted);text-transform:uppercase;letter-spacing:.06em;padding:4px 12px 6px">Core</p>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;min-width:380px">
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
                <div style="height:1px;background:var(--morphos-color-border);margin:4px 0" />
                <NavigationMenuLink href="#" onClick={(e: MouseEvent) => { e.preventDefault(); }} class="morphos-navigation-menu-link">
                  <strong>Press</strong>
                  <span>News and media</span>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <li><NavigationMenuLink href="#" onClick={(e: MouseEvent) => { e.preventDefault(); }} class="morphos-navigation-menu-link">Docs</NavigationMenuLink></li>
          </NavigationMenuList>
        </NavigationMenu>
        </div>
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
