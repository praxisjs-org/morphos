import { StatefulComponent } from "@praxisjs/core";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Toolbar, ToolbarButton, ToolbarSeparator } from "@morphos/layout";

const SHARED_STYLE = `
  .toolbar-btn.active {
    background: #ede9fe;
    color: var(--accent, #6d5bbd);
  }
  .demo-label {
    font-size: 11px;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 12px;
    font-family: sans-serif;
  }
`;

// ---------- Default (formatting toolbar) ----------

@Component()
class ToolbarDefaultDemo extends StatefulComponent {
  @State() toolbar = new Toolbar({ orientation: "horizontal" });
  @State() activeFormats: Set<string> = new Set();
  @State() lastAlign = "";

  onBeforeMount() {
    this.toolbar.onBeforeMount?.();
    this.activeFormats = new Set();
    this.lastAlign = "";
  }

  toggleFormat(fmt: string) {
    const next = new Set(this.activeFormats);
    if (next.has(fmt)) {
      next.delete(fmt);
    } else {
      next.add(fmt);
    }
    this.activeFormats = next;
  }

  render() {
    const fmtBtns = [
      { fmt: "bold", label: <strong>B</strong> },
      { fmt: "italic", label: <em>I</em> },
      { fmt: "underline", label: <u>U</u> },
      { fmt: "strike", label: <s>S</s> },
    ];
    const alignBtns = [
      { key: "left", label: "☰", title: "Align left" },
      { key: "center", label: "≡", title: "Align center" },
      { key: "right", label: "⠿", title: "Align right" },
    ];

    return (
      <div style="font-family:sans-serif;padding:32px">
        <style>{SHARED_STYLE}</style>
        <p class="demo-label">Rich text formatting toolbar</p>
        <p style="font-size:13px;color:#6b7280;margin:0 0 16px">
          Arrow keys navigate between buttons. Tab exits the toolbar.
        </p>

        <div
          role="toolbar"
          aria-label="Text formatting"
          aria-orientation="horizontal"
          data-orientation="horizontal"
          class="morphos-toolbar"
          onKeyDown={(e: KeyboardEvent) => { this.toolbar.handleKeyDown(e); }}
        >
          {fmtBtns.map(({ fmt, label }) => (
            <ToolbarButton
              key={fmt}
              toolbar={this.toolbar}
              class={() => `morphos-toolbar-button${this.activeFormats.has(fmt) ? " active" : ""}`}
              onClick={() => { this.toggleFormat(fmt); }}
              aria-label={fmt.charAt(0).toUpperCase() + fmt.slice(1)}
            >
              {label}
            </ToolbarButton>
          ))}
          <ToolbarSeparator toolbar={this.toolbar} class="morphos-toolbar-separator" />
          {alignBtns.map(({ key, label, title }) => (
            <ToolbarButton
              key={key}
              toolbar={this.toolbar}
              class={() => `morphos-toolbar-button${this.lastAlign === key ? " active" : ""}`}
              onClick={() => { this.lastAlign = key; }}
              aria-label={title}
            >
              {label}
            </ToolbarButton>
          ))}
          <ToolbarSeparator toolbar={this.toolbar} class="morphos-toolbar-separator" />
          <ToolbarButton
            toolbar={this.toolbar}
            class="morphos-toolbar-button"
            aria-label="Insert image"
            onClick={() => { /* no-op in demo */ }}
          >
            Image
          </ToolbarButton>
          <ToolbarButton
            toolbar={this.toolbar}
            class="morphos-toolbar-button"
            aria-label="Insert link"
            onClick={() => { /* no-op in demo */ }}
          >
            Link
          </ToolbarButton>
          <ToolbarButton
            toolbar={this.toolbar}
            disabled
            class="morphos-toolbar-button"
            aria-label="Insert code block (unavailable)"
          >
            {"</>"}
          </ToolbarButton>
        </div>

        {/* Live preview */}
        <div
          style={() => [
            "margin-top:14px;padding:14px 16px;border:1px solid #e5e7eb;border-radius:8px;",
            "background:#fff;font-size:14px;color:#374151;max-width:520px;line-height:1.7;",
            `font-weight:${this.activeFormats.has("bold") ? "700" : "400"};`,
            `font-style:${this.activeFormats.has("italic") ? "italic" : "normal"};`,
            `text-decoration:${[
              this.activeFormats.has("underline") ? "underline" : "",
              this.activeFormats.has("strike") ? "line-through" : "",
            ].filter(Boolean).join(" ") || "none"};`,
            `text-align:${this.lastAlign || "left"};`,
          ].join("")}
        >
          The quick brown fox jumps over the lazy dog. Click toolbar buttons to apply
          formatting to this preview text.
        </div>
      </div>
    );
  }
}

// ---------- Vertical story ----------

interface VerticalArgs {
  orientation: "horizontal" | "vertical";
}

@Component()
class ToolbarVerticalDemo extends StatefulComponent {
  @Prop() orientation: "horizontal" | "vertical" = "vertical";

  @State() toolbar = new Toolbar({ orientation: "vertical" });
  @State() activeTool = "select";

  onBeforeMount() {
    this.toolbar = new Toolbar({ orientation: this.orientation });
    this.toolbar.onBeforeMount?.();
    this.activeTool = "select";
  }

  render() {
    const tools = [
      { key: "select", label: "↖", title: "Select" },
      { key: "draw", label: "✏", title: "Draw" },
      { key: "shape", label: "◻", title: "Shape" },
      { key: "text", label: "T", title: "Text" },
    ];
    const viewTools = [
      { key: "zoom-in", label: "+", title: "Zoom in" },
      { key: "zoom-out", label: "−", title: "Zoom out" },
    ];

    return (
      <div style="font-family:sans-serif;padding:32px">
        <style>{SHARED_STYLE}</style>
        <p class="demo-label">Vertical action sidebar</p>
        <p style="font-size:13px;color:#6b7280;margin:0 0 16px">
          Up / Down arrows navigate between buttons. The toolbar orientation prop is
          passed to the instance.
        </p>

        <div style="display:flex;gap:24px;align-items:flex-start">
          <div
            role="toolbar"
            aria-label="Drawing tools"
            aria-orientation={() => this.orientation}
            data-orientation={() => this.orientation}
            class="morphos-toolbar"
            onKeyDown={(e: KeyboardEvent) => { this.toolbar.handleKeyDown(e); }}
          >
            {tools.map(({ key, label, title }) => (
              <ToolbarButton
                key={key}
                toolbar={this.toolbar}
                class={() => `morphos-toolbar-button${this.activeTool === key ? " active" : ""}`}
                aria-label={title}
                onClick={() => { this.activeTool = key; }}
              >
                {label}
              </ToolbarButton>
            ))}
            <ToolbarSeparator toolbar={this.toolbar} class="morphos-toolbar-separator" />
            {viewTools.map(({ key, label, title }) => (
              <ToolbarButton
                key={key}
                toolbar={this.toolbar}
                class="morphos-toolbar-button"
                aria-label={title}
                onClick={() => { this.activeTool = key; }}
              >
                {label}
              </ToolbarButton>
            ))}
          </div>

          <div>
            <p style="font-size:13px;color:#6b7280;margin:0 0 8px">Active tool:</p>
            <span style="font-size:14px;font-weight:600;color:#111827">
              {() => this.activeTool}
            </span>
          </div>
        </div>

        <p style="margin:16px 0 0;font-size:12px;font-family:monospace;color:#9ca3af">
          orientation="{this.orientation}"
        </p>
      </div>
    );
  }
}

// ---------- Meta ----------

const meta: Meta<VerticalArgs> = {
  title: "Layout/Toolbar",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A group of action buttons with roving tabindex keyboard navigation. Supports horizontal (Left/Right arrow) and vertical (Up/Down arrow) orientations. Styled here with the `@morphos/styles` `morphos-toolbar` recipe.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description: "Arrow key direction used to move focus between toolbar items.",
    },
  },
  args: {
    orientation: "vertical",
  },
};

export default meta;

type Story = StoryObj<VerticalArgs>;

export const Default: Story = {
  name: "Default — text formatting toolbar",
  render: () => <ToolbarDefaultDemo />,
};

export const Vertical: Story = {
  name: "Vertical — action sidebar",
  render: (args) => <ToolbarVerticalDemo orientation={args.orientation} />,
};
