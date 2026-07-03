import { StatefulComponent } from "@praxisjs/core";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  ScrollArea,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@morphos/layout";

type ScrollAreaType = "hover" | "always" | "auto" | "scroll" | "hidden";

const SHARED_STYLE = `
  .demo-label {
    font-size: 11px;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 10px;
    font-family: sans-serif;
  }
`;

const CONTACTS = [
  { name: "Contact A", role: "Designer", color: "#8b5cf6", initials: "CA" },
  { name: "Contact B", role: "Engineer", color: "#3b82f6", initials: "CB" },
  { name: "Contact C", role: "Product", color: "#10b981", initials: "CC" },
  { name: "Contact D", role: "Marketing", color: "#f59e0b", initials: "CD" },
  { name: "Contact E", role: "Designer", color: "#ef4444", initials: "CE" },
  { name: "Contact F", role: "Engineer", color: "#6366f1", initials: "CF" },
  { name: "Contact G", role: "Sales", color: "#14b8a6", initials: "CG" },
  { name: "Contact H", role: "Support", color: "#f97316", initials: "CH" },
  { name: "Contact I", role: "Engineer", color: "#ec4899", initials: "CI" },
  { name: "Contact J", role: "Legal", color: "#64748b", initials: "CJ" },
  { name: "Contact K", role: "Finance", color: "#84cc16", initials: "CK" },
  { name: "Contact L", role: "DevOps", color: "#06b6d4", initials: "CL" },
];

const LOG_ENTRIES = [
  { level: "info", msg: "[12:00:01] Server started on port 3000" },
  { level: "success", msg: "[12:00:02] Database connected" },
  { level: "info", msg: "[12:00:05] GET /api/users 200 12ms" },
  { level: "info", msg: "[12:00:07] GET /api/posts 200 8ms" },
  { level: "warn", msg: "[12:00:09] Rate limit approaching (85%)" },
  { level: "info", msg: "[12:00:11] POST /api/items 201 45ms" },
  { level: "error", msg: "[12:00:14] DB timeout after 5000ms" },
  { level: "warn", msg: "[12:00:15] Retry attempt 1/3" },
  { level: "success", msg: "[12:00:16] Retry succeeded" },
  { level: "info", msg: "[12:00:20] GET /api/reports 200 130ms" },
  { level: "info", msg: "[12:00:23] Cache miss for key: user:42" },
  { level: "success", msg: "[12:00:23] Cache populated" },
  { level: "info", msg: "[12:00:28] WebSocket connected client-9f3a" },
  { level: "warn", msg: "[12:00:31] Memory usage at 78%" },
  { level: "info", msg: "[12:00:35] Scheduled job ran in 210ms" },
];

// ---------- ContactList story ----------

@Component()
class ContactListDemo extends StatefulComponent {
  @Prop() type: ScrollAreaType = "hover";
  @State() scrollArea = new ScrollArea({ type: "hover" });

  onBeforeMount() {
    this.scrollArea = new ScrollArea({ type: this.type });
    this.scrollArea.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:32px">
        <style>{`
          ${SHARED_STYLE}
          .list-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.12s;
          }
          .list-item:hover { background: #f9fafb }
          .avatar {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 700;
            color: #fff;
            flex-shrink: 0;
          }
          .list-name { font-size: 13px; font-weight: 500; color: #111827 }
          .list-role { font-size: 11px; color: #9ca3af }
        `}</style>
        <p class="demo-label">type="{this.type}" — contact list (12 entries)</p>
        <div
          class="morphos-scroll-area"
          style="width:280px;height:240px"
          data-type={this.type}
        >
          <ScrollAreaViewport scrollArea={this.scrollArea} class="morphos-scroll-area-viewport">
            <div style="padding:8px;box-sizing:border-box">
              {CONTACTS.map((person) => (
                <div class="list-item" key={person.name}>
                  <div class="avatar" style={`background:${person.color}`}>
                    {person.initials}
                  </div>
                  <div>
                    <div class="list-name">{person.name}</div>
                    <div class="list-role">{person.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollAreaViewport>
          <ScrollAreaScrollbar scrollArea={this.scrollArea} orientation="vertical" class="morphos-scroll-area-scrollbar">
            <ScrollAreaThumb scrollArea={this.scrollArea} class="morphos-scroll-area-thumb" />
          </ScrollAreaScrollbar>
        </div>
        <p style="margin:12px 0 0;font-size:12px;font-family:monospace;color:#9ca3af">
          {this.type === "hover"
            ? 'type="hover" — hover the list to reveal the scrollbar'
            : this.type === "hidden"
              ? 'type="hidden" — no custom scrollbar; content still scrolls natively'
              : `type="${this.type}" — scrollbar always visible`}
        </p>
      </div>
    );
  }
}

// ---------- LogViewer story ----------

@Component()
class LogViewerDemo extends StatefulComponent {
  @State() scrollArea = new ScrollArea({ type: "always" });

  onBeforeMount() {
    this.scrollArea.onBeforeMount?.();
  }

  render() {
    const levelColor: Record<string, string> = {
      info: "#3b82f6",
      success: "#16a34a",
      warn: "#d97706",
      error: "#dc2626",
    };
    const levelBg: Record<string, string> = {
      info: "#eff6ff",
      success: "#f0fdf4",
      warn: "#fffbeb",
      error: "#fef2f2",
    };

    return (
      <div style="font-family:sans-serif;padding:32px">
        <style>{`
          ${SHARED_STYLE}
          .log-entry {
            font-size: 12px;
            font-family: monospace;
            padding: 4px 8px;
            border-radius: 4px;
            margin-bottom: 2px;
            line-height: 1.5;
          }
        `}</style>
        <p class="demo-label">type="always" — activity log</p>
        <div class="morphos-scroll-area" style="width:480px;height:220px" data-type="always">
          <ScrollAreaViewport scrollArea={this.scrollArea} class="morphos-scroll-area-viewport">
            <div style="padding:8px;box-sizing:border-box">
              {LOG_ENTRIES.map((entry, i) => (
                <div
                  key={i}
                  class="log-entry"
                  style={`color:${levelColor[entry.level] ?? "#374151"};background:${levelBg[entry.level] ?? "#f9fafb"}`}
                >
                  {entry.msg}
                </div>
              ))}
            </div>
          </ScrollAreaViewport>
          <ScrollAreaScrollbar scrollArea={this.scrollArea} orientation="vertical" class="morphos-scroll-area-scrollbar">
            <ScrollAreaThumb scrollArea={this.scrollArea} class="morphos-scroll-area-thumb" />
          </ScrollAreaScrollbar>
        </div>
        <p style="margin:12px 0 0;font-size:12px;font-family:monospace;color:#9ca3af">
          type="always" — scrollbar always visible
        </p>
      </div>
    );
  }
}

// ---------- HorizontalScroll story ----------

@Component()
class HorizontalScrollDemo extends StatefulComponent {
  @Prop() type: ScrollAreaType = "always";
  @State() scrollArea = new ScrollArea({ type: "always" });

  onBeforeMount() {
    this.scrollArea = new ScrollArea({ type: this.type });
    this.scrollArea.onBeforeMount?.();
  }

  render() {
    const cards = [
      { icon: "Rocket", title: "Deploy", sub: "Production" },
      { icon: "Chart", title: "Analytics", sub: "Dashboard" },
      { icon: "Lock", title: "Auth", sub: "OAuth 2.0" },
      { icon: "Box", title: "Storage", sub: "S3 Compatible" },
      { icon: "Chat", title: "Realtime", sub: "WebSockets" },
      { icon: "Bot", title: "AI", sub: "LLM Gateway" },
      { icon: "Bell", title: "Notify", sub: "Push & Email" },
      { icon: "DB", title: "Database", sub: "PostgreSQL" },
      { icon: "Log", title: "Logs", sub: "Structured JSON" },
    ];

    return (
      <div style="font-family:sans-serif;padding:32px">
        <style>{`
          ${SHARED_STYLE}
          .card-strip {
            display: flex;
            gap: 12px;
            width: max-content;
          }
          .card-chip {
            width: 130px;
            flex-shrink: 0;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 14px;
            background: #fff;
            cursor: pointer;
            transition: border-color 0.15s, box-shadow 0.15s;
          }
          .card-chip:hover {
            border-color: #c4b5fd;
            box-shadow: 0 2px 8px rgba(109,91,189,0.1);
          }
          .card-icon {
            font-size: 11px;
            font-weight: 700;
            color: #6d5bbd;
            background: #ede9fe;
            border-radius: 4px;
            padding: 3px 6px;
            display: inline-block;
            margin-bottom: 10px;
          }
          .card-title { font-size: 13px; font-weight: 600; color: #111827 }
          .card-sub { font-size: 11px; color: #9ca3af; margin-top: 2px }
        `}</style>
        <p class="demo-label">Horizontal card row — type="{this.type}"</p>
        <div class="morphos-scroll-area" style="width:480px" data-type={this.type}>
          <ScrollAreaViewport scrollArea={this.scrollArea} class="morphos-scroll-area-viewport">
            <div style="padding:16px 16px 24px;box-sizing:border-box" class="card-strip">
              {cards.map((card) => (
                <div class="card-chip" key={card.title}>
                  <div class="card-icon">{card.icon}</div>
                  <div class="card-title">{card.title}</div>
                  <div class="card-sub">{card.sub}</div>
                </div>
              ))}
            </div>
          </ScrollAreaViewport>
          <ScrollAreaScrollbar scrollArea={this.scrollArea} orientation="horizontal" class="morphos-scroll-area-scrollbar">
            <ScrollAreaThumb scrollArea={this.scrollArea} orientation="horizontal" class="morphos-scroll-area-thumb" />
          </ScrollAreaScrollbar>
        </div>
        <p style="margin:12px 0 0;font-size:12px;font-family:monospace;color:#9ca3af">
          orientation="horizontal" type="{this.type}"
        </p>
      </div>
    );
  }
}

// ---------- Meta ----------

const meta: Meta<{ type: ScrollAreaType }> = {
  title: "Layout/ScrollArea",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Custom-styled scrollable containers with native scroll behavior. Hides the browser scrollbar and optionally replaces it with a styled track and thumb. Styled here with the `@morphos/styles` `morphos-scroll-area` recipe. `type=\"hover\"` fades the scrollbar out until the pointer enters the area — use the control below instead of hovering to see it toggle.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<{ type: ScrollAreaType }>;

export const ContactList: Story = {
  name: "Contact List — type=hover",
  argTypes: {
    type: {
      control: "select",
      options: ["hover", "always", "auto", "scroll", "hidden"],
      description: "Controls when the scrollbar is visible. \"hover\" fades it out until the pointer enters.",
    },
  },
  args: {
    type: "hover",
  },
  render: (args) => <ContactListDemo type={args.type} />,
};

export const LogViewer: Story = {
  name: "Log Viewer — type=always",
  render: () => <LogViewerDemo />,
};

export const HorizontalScroll: Story = {
  name: "Horizontal Card Row",
  argTypes: {
    type: {
      control: "select",
      options: ["hover", "always", "auto", "scroll", "hidden"],
      description: "Controls when the scrollbar is visible. \"hover\" fades it out until the pointer enters.",
    },
  },
  args: {
    type: "hover",
  },
  render: (args) => <HorizontalScrollDemo type={args.type} />,
};
