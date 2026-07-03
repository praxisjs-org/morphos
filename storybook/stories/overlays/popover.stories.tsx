import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Button, Checkbox, Input } from "@morphos/inputs";
import { Popover, PopoverContent, PopoverTrigger } from "@morphos/overlays";

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const SHARED_STYLES = `
  .pop-heading {
    font-size: 0.875rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 6px;
  }
  .pop-body {
    font-size: 0.8125rem;
    color: #6b7280;
    line-height: 1.5;
    margin: 0 0 12px;
  }
  .pop-check-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
    font-size: 0.8125rem;
    color: #374151;
    cursor: pointer;
  }
  .form-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 10px;
  }
  .form-field label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #374151;
  }
  .demo-wrapper {
    font-family: sans-serif;
    padding: 40px;
  }
  .demo-row {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    align-items: flex-start;
    margin-top: 8px;
  }
  .demo-col {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .demo-label {
    font-size: 0.6875rem;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
  }
`;

// ---------------------------------------------------------------------------
// Default story — "More options" popover with settings checkboxes
// ---------------------------------------------------------------------------

@Component()
class PopoverDefaultDemo extends StatefulComponent {
  @State() popover = new Popover();
  @State() compact = true;
  @State() grid = false;
  @State() preview = true;
  @State() badges = false;

  onBeforeMount() {
    this.popover.onBeforeMount?.();
    this.compact = true;
    this.grid = false;
    this.preview = true;
    this.badges = false;
  }

  render() {
    return (
      <div class="demo-wrapper">
        <style>{SHARED_STYLES}</style>
        <div class="demo-row">
          <div class="demo-col">
            <span class="demo-label">Options popover</span>
            <PopoverTrigger popover={this.popover} class="morphos-button morphos-button--outline">
              More options ⋯
            </PopoverTrigger>
            <PopoverContent popover={this.popover} class="morphos-popover-content" aria-label="Display options">
              <p class="pop-heading">Display options</p>
              <div class="pop-check-row">
                <Checkbox
                  id="opt-compact"
                  class="morphos-checkbox"
                  checked={() => this.compact}
                  onCheckedChange={(val: boolean) => { this.compact = val; }}
                />
                <label for="opt-compact">Compact mode</label>
              </div>
              <div class="pop-check-row">
                <Checkbox
                  id="opt-grid"
                  class="morphos-checkbox"
                  checked={() => this.grid}
                  onCheckedChange={(val: boolean) => { this.grid = val; }}
                />
                <label for="opt-grid">Grid layout</label>
              </div>
              <div class="pop-check-row">
                <Checkbox
                  id="opt-preview"
                  class="morphos-checkbox"
                  checked={() => this.preview}
                  onCheckedChange={(val: boolean) => { this.preview = val; }}
                />
                <label for="opt-preview">Show previews</label>
              </div>
              <div class="pop-check-row">
                <Checkbox
                  id="opt-badges"
                  class="morphos-checkbox"
                  checked={() => this.badges}
                  onCheckedChange={(val: boolean) => { this.badges = val; }}
                />
                <label for="opt-badges">Show status badges</label>
              </div>
              <div style="margin-top:12px">
                <Button class="morphos-button" onClick={() => { this.popover.closePopover(); }}>
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </div>
        </div>
      </div>
    );
  }
}

// ---------------------------------------------------------------------------
// Form story — inline-edit mini form
// ---------------------------------------------------------------------------

@Component()
class PopoverFormDemo extends StatefulComponent {
  @State() popover = new Popover();

  onBeforeMount() {
    this.popover.onBeforeMount?.();
  }

  render() {
    return (
      <div class="demo-wrapper">
        <style>{SHARED_STYLES}</style>
        <div class="demo-row">
          <div class="demo-col">
            <span class="demo-label">Inline form</span>
            <PopoverTrigger popover={this.popover} class="morphos-button morphos-button--outline">
              Edit details
            </PopoverTrigger>
            <PopoverContent popover={this.popover} class="morphos-popover-content" aria-label="Edit details">
              <p class="pop-heading">Edit project</p>
              <div class="form-field">
                <label for="pop-name">Project name</label>
                <Input id="pop-name" class="morphos-input" placeholder="My project" />
              </div>
              <div class="form-field">
                <label for="pop-tag">Tag</label>
                <Input id="pop-tag" class="morphos-input" placeholder="design, dev…" />
              </div>
              <div style="display:flex;gap:8px;margin-top:4px">
                <Button
                  class="morphos-button morphos-button--outline"
                  onClick={() => { this.popover.closePopover(); }}
                >
                  Cancel
                </Button>
                <Button class="morphos-button" onClick={() => { this.popover.closePopover(); }}>
                  Save
                </Button>
              </div>
            </PopoverContent>
          </div>
        </div>
      </div>
    );
  }
}

// ---------------------------------------------------------------------------
// Positions story — two popovers showing top vs bottom placement
// ---------------------------------------------------------------------------

@Component()
class PopoverPositionsDemo extends StatefulComponent {
  @State() popoverTop = new Popover({ side: "top" });
  @State() popoverBottom = new Popover({ side: "bottom" });

  onBeforeMount() {
    this.popoverTop.onBeforeMount?.();
    this.popoverBottom.onBeforeMount?.();
  }

  render() {
    return (
      <div class="demo-wrapper" style="padding-top:100px">
        <style>{SHARED_STYLES}</style>
        <div class="demo-row">
          <div class="demo-col">
            <span class="demo-label">Top</span>
            <PopoverTrigger popover={this.popoverTop} class="morphos-button morphos-button--outline">
              Open above ↑
            </PopoverTrigger>
            <PopoverContent popover={this.popoverTop} class="morphos-popover-content" aria-label="Top popover">
              <p class="pop-heading">Positioned above</p>
              <p class="pop-body">This popover opens above its trigger using <code>side="top"</code>.</p>
              <Button class="morphos-button" onClick={() => { this.popoverTop.closePopover(); }}>
                Close
              </Button>
            </PopoverContent>
          </div>

          <div class="demo-col">
            <span class="demo-label">Bottom (default)</span>
            <PopoverTrigger popover={this.popoverBottom} class="morphos-button morphos-button--outline">
              Open below ↓
            </PopoverTrigger>
            <PopoverContent popover={this.popoverBottom} class="morphos-popover-content" aria-label="Bottom popover">
              <p class="pop-heading">Positioned below</p>
              <p class="pop-body">This popover opens below its trigger — the default <code>side="bottom"</code>.</p>
              <Button class="morphos-button" onClick={() => { this.popoverBottom.closePopover(); }}>
                Close
              </Button>
            </PopoverContent>
          </div>
        </div>
      </div>
    );
  }
}

// ---------------------------------------------------------------------------
// Meta + story exports
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: "Overlays/Popover",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => <PopoverDefaultDemo />,
};

export const Form: Story = {
  name: "Form",
  render: () => <PopoverFormDemo />,
};

export const Positions: Story = {
  name: "Positions",
  render: () => <PopoverPositionsDemo />,
};
