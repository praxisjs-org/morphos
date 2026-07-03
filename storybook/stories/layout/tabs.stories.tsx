import { StatefulComponent } from "@praxisjs/core";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Tab, TabList, TabPanel, Tabs } from "@morphos/layout";

// ---------- Default story ----------

interface DefaultArgs {
  defaultValue: "tab1" | "tab2" | "tab3";
}

@Component()
class TabsDefaultDemo extends StatefulComponent {
  @Prop() defaultValue: string = "tab1";

  @State() tabs = new Tabs({ defaultValue: "tab1" });

  onBeforeMount() {
    this.tabs = new Tabs({ defaultValue: this.defaultValue });
    this.tabs.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:32px">
        <div class="morphos-tabs" style="max-width:560px">
          <TabList tabs={this.tabs} aria-label="Product information" class="morphos-tabs-list">
            <Tab tabs={this.tabs} value="tab1" class="morphos-tabs-tab">Overview</Tab>
            <Tab tabs={this.tabs} value="tab2" class="morphos-tabs-tab">Specifications</Tab>
            <Tab tabs={this.tabs} value="tab3" class="morphos-tabs-tab">Reviews</Tab>
          </TabList>

          <TabPanel tabs={this.tabs} value="tab1" class="morphos-tabs-panel">
            <strong style="display:block;margin-bottom:8px">Morphos UI Kit</strong>
            <p style="margin:0">
              A headless primitive component library for PraxisJS. Every component ships
              with zero default styles — you control the look entirely through CSS.
              State is exposed via <code>data-*</code> attributes so styling never
              requires class manipulation.
            </p>
          </TabPanel>

          <TabPanel tabs={this.tabs} value="tab2" class="morphos-tabs-panel">
            <table style="border-collapse:collapse;width:100%;font-size:13px">
              <tbody>
                {[
                  ["Framework", "PraxisJS"],
                  ["Language", "TypeScript"],
                  ["Styling", "Bring your own CSS"],
                  ["Bundle size", "Tree-shakeable, zero-runtime styles"],
                  ["ARIA", "Full WAI-ARIA compliance"],
                  ["Keyboard", "Complete keyboard navigation"],
                ].map(([label, value]) => (
                  <tr key={label} style="border-bottom:1px solid #f3f4f6">
                    <td style="padding:8px 0;color:#6b7280;width:160px">{label}</td>
                    <td style="padding:8px 0;color:#111827;font-weight:500">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabPanel>

          <TabPanel tabs={this.tabs} value="tab3" class="morphos-tabs-panel">
            {[
              { author: "Reviewer A", stars: 5, text: "Finally a headless library that feels native to PraxisJS. The data-* convention is brilliant." },
              { author: "Reviewer B", stars: 5, text: "Zero friction to style. I dropped my old CSS-in-JS solution immediately." },
            ].map((r) => (
              <div key={r.author} style="padding:12px 0;border-bottom:1px solid #f3f4f6">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                  <strong style="font-size:13px">{r.author}</strong>
                  <span style="color:#f59e0b;font-size:12px">{"★".repeat(r.stars)}</span>
                </div>
                <p style="margin:0;font-size:13px;color:#4b5563">{r.text}</p>
              </div>
            ))}
          </TabPanel>
        </div>

        <p style="margin:16px 0 0;font-size:12px;font-family:monospace;color:#9ca3af">
          defaultValue="{this.defaultValue}" &nbsp; selectedValue="{() => this.tabs.selectedValue ?? "none"}"
        </p>
      </div>
    );
  }
}

// ---------- Vertical story ----------

@Component()
class TabsVerticalDemo extends StatefulComponent {
  @State() tabs = new Tabs({ defaultValue: "account", orientation: "vertical" });

  onBeforeMount() {
    this.tabs.onBeforeMount?.();
  }

  render() {
    const sections = [
      {
        value: "account",
        label: "Account",
        content: (
          <div>
            <p style="margin:0 0 12px;font-weight:600;font-size:15px">Account details</p>
            <p style="margin:0;font-size:13px;color:#4b5563">
              Manage your display name, email address, and login credentials.
            </p>
          </div>
        ),
      },
      {
        value: "privacy",
        label: "Privacy",
        content: (
          <div>
            <p style="margin:0 0 12px;font-weight:600;font-size:15px">Privacy settings</p>
            <p style="margin:0;font-size:13px;color:#4b5563">
              Control who can see your profile, activity, and contact information.
            </p>
          </div>
        ),
      },
      {
        value: "notifications",
        label: "Notifications",
        content: (
          <div>
            <p style="margin:0 0 12px;font-weight:600;font-size:15px">Notification preferences</p>
            <p style="margin:0;font-size:13px;color:#4b5563">
              Choose which events trigger email, push, or in-app notifications.
            </p>
          </div>
        ),
      },
      {
        value: "billing",
        label: "Billing",
        content: (
          <div>
            <p style="margin:0 0 12px;font-weight:600;font-size:15px">Billing & subscription</p>
            <p style="margin:0;font-size:13px;color:#4b5563">
              View invoices, update your payment method, or change your plan.
            </p>
          </div>
        ),
      },
    ];

    return (
      <div style="font-family:sans-serif;padding:32px">
        <div class="morphos-tabs" style="max-width:640px;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;background:#fff" data-orientation="vertical">
          <TabList tabs={this.tabs} aria-label="Settings" class="morphos-tabs-list">
            {sections.map((s) => (
              <Tab key={s.value} tabs={this.tabs} value={s.value} class="morphos-tabs-tab">
                {s.label}
              </Tab>
            ))}
          </TabList>

          {sections.map((s) => (
            <TabPanel key={s.value} tabs={this.tabs} value={s.value} class="morphos-tabs-panel">
              <div style="padding:24px;flex:1">{s.content}</div>
            </TabPanel>
          ))}
        </div>

        <p style="margin:14px 0 0;font-size:12px;font-family:monospace;color:#9ca3af">
          orientation="vertical"
        </p>
      </div>
    );
  }
}

// ---------- Controlled story ----------

@Component()
class TabsControlledDemo extends StatefulComponent {
  @State() value = "design";
  @State() changeCount = 0;

  @State() tabs = new Tabs({ onValueChange: () => { /* handled below */ } });

  onBeforeMount() {
    this.value = "design";
    this.changeCount = 0;
    this.tabs = new Tabs({
      value: () => this.value,
      onValueChange: (v: string) => {
        this.value = v;
        this.changeCount++;
      },
    });
    this.tabs.onBeforeMount?.();
  }

  render() {
    const tabs = [
      { value: "design", label: "Design" },
      { value: "code", label: "Code" },
      { value: "preview", label: "Preview" },
    ];

    return (
      <div style="font-family:sans-serif;padding:32px">
        <p style="font-size:13px;color:#6b7280;margin:0 0 16px">
          Controlled mode — parent owns the <code>value</code> prop. External buttons
          switch tabs independently of the tab list.
        </p>

        <div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap">
          {tabs.map((t) => (
            <button
              key={t.value}
              class={() => `morphos-button ${this.value === t.value ? "" : "morphos-button--outline"}`}
              onClick={() => { this.value = t.value; this.changeCount++; }}
            >
              Jump to {t.label}
            </button>
          ))}
        </div>

        <div class="morphos-tabs" style="max-width:560px">
          <TabList tabs={this.tabs} aria-label="Editor mode" class="morphos-tabs-list">
            {tabs.map((t) => (
              <Tab key={t.value} tabs={this.tabs} value={t.value} class="morphos-tabs-tab">
                {t.label}
              </Tab>
            ))}
          </TabList>

          <TabPanel tabs={this.tabs} value="design" class="morphos-tabs-panel">
            Canvas and component properties would render here.
          </TabPanel>
          <TabPanel tabs={this.tabs} value="code" class="morphos-tabs-panel">
            <code style="font-size:13px;color:#374151">{"<Button disabled={false}>Click me</Button>"}</code>
          </TabPanel>
          <TabPanel tabs={this.tabs} value="preview" class="morphos-tabs-panel">
            Rendered component preview would appear here.
          </TabPanel>
        </div>

        <p style="margin:14px 0 0;font-size:12px;font-family:monospace;color:#9ca3af">
          value="{() => this.value}"&nbsp; changes={"{"}
          {() => String(this.changeCount)}
          {"}"}
        </p>
      </div>
    );
  }
}

// ---------- Meta ----------

const meta: Meta<DefaultArgs> = {
  title: "Layout/Tabs",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Accessible tab panels with keyboard navigation. Supports horizontal and vertical orientations, uncontrolled (defaultValue) and controlled (value) modes. Styled here with the `@morphos/styles` `morphos-tabs` recipe.",
      },
    },
  },
  argTypes: {
    defaultValue: {
      control: "select",
      options: ["tab1", "tab2", "tab3"],
      description: "Which tab is selected on initial mount (uncontrolled).",
    },
  },
  args: {
    defaultValue: "tab1",
  },
};

export default meta;

type Story = StoryObj<DefaultArgs>;

export const Default: Story = {
  name: "Default — horizontal tabs",
  render: (args) => <TabsDefaultDemo defaultValue={args.defaultValue} />,
};

export const Vertical: Story = {
  name: "Vertical — settings sidebar",
  render: () => <TabsVerticalDemo />,
};

export const Controlled: Story = {
  name: "Controlled — external value",
  render: () => <TabsControlledDemo />,
};
