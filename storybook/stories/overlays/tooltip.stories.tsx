import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Tooltip, TooltipContent, TooltipTrigger } from "@morphos/overlays";

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const SHARED_STYLES = `
  .icon-btn {
    width: 40px;
    height: 40px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .demo-wrapper {
    font-family: sans-serif;
    padding: 40px;
  }
  .demo-row {
    display: flex;
    gap: 32px;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 8px;
  }
  .demo-col {
    display: flex;
    flex-direction: column;
    align-items: center;
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
// Default story — single button with configurable tooltip content
// ---------------------------------------------------------------------------

@Component()
class TooltipDefaultDemo extends StatefulComponent {
  @State() tooltip = new Tooltip({ openDelay: 400, closeDelay: 0 });

  onBeforeMount() {
    this.tooltip.onBeforeMount?.();
  }

  render() {
    return (
      <div class="demo-wrapper">
        <style>{SHARED_STYLES}</style>
        <div class="demo-row">
          <div class="demo-col">
            <span class="demo-label">Hover the button</span>
            <TooltipTrigger tooltip={this.tooltip}>
              <button class="morphos-button morphos-button--outline" type="button">Hover me</button>
            </TooltipTrigger>
            <TooltipContent tooltip={this.tooltip} class="morphos-tooltip-content">
              This is a tooltip
            </TooltipContent>
          </div>
        </div>
      </div>
    );
  }
}

// ---------------------------------------------------------------------------
// Positions story — top, right, bottom, left
// ---------------------------------------------------------------------------

@Component()
class TooltipPositionsDemo extends StatefulComponent {
  @State() ttTop = new Tooltip({ side: "top", openDelay: 0 });
  @State() ttRight = new Tooltip({ side: "right", openDelay: 0 });
  @State() ttBottom = new Tooltip({ side: "bottom", openDelay: 0 });
  @State() ttLeft = new Tooltip({ side: "left", openDelay: 0 });

  onBeforeMount() {
    this.ttTop.onBeforeMount?.();
    this.ttRight.onBeforeMount?.();
    this.ttBottom.onBeforeMount?.();
    this.ttLeft.onBeforeMount?.();
  }

  render() {
    return (
      <div class="demo-wrapper" style="padding:80px 40px">
        <style>{SHARED_STYLES}</style>
        <div class="demo-row" style="justify-content:center">
          <div class="demo-col">
            <span class="demo-label">Top</span>
            <TooltipTrigger tooltip={this.ttTop}>
              <button class="morphos-button morphos-button--outline icon-btn" type="button">↑</button>
            </TooltipTrigger>
            <TooltipContent tooltip={this.ttTop} class="morphos-tooltip-content">
              Tooltip above
            </TooltipContent>
          </div>

          <div class="demo-col">
            <span class="demo-label">Right</span>
            <TooltipTrigger tooltip={this.ttRight}>
              <button class="morphos-button morphos-button--outline icon-btn" type="button">→</button>
            </TooltipTrigger>
            <TooltipContent tooltip={this.ttRight} class="morphos-tooltip-content">
              Tooltip to the right
            </TooltipContent>
          </div>

          <div class="demo-col">
            <span class="demo-label">Bottom</span>
            <TooltipTrigger tooltip={this.ttBottom}>
              <button class="morphos-button morphos-button--outline icon-btn" type="button">↓</button>
            </TooltipTrigger>
            <TooltipContent tooltip={this.ttBottom} class="morphos-tooltip-content">
              Tooltip below
            </TooltipContent>
          </div>

          <div class="demo-col">
            <span class="demo-label">Left</span>
            <TooltipTrigger tooltip={this.ttLeft}>
              <button class="morphos-button morphos-button--outline icon-btn" type="button">←</button>
            </TooltipTrigger>
            <TooltipContent tooltip={this.ttLeft} class="morphos-tooltip-content">
              Tooltip to the left
            </TooltipContent>
          </div>
        </div>
      </div>
    );
  }
}

// ---------------------------------------------------------------------------
// Disabled story — tooltip on a disabled button (wrapped in span)
// ---------------------------------------------------------------------------

@Component()
class TooltipDisabledDemo extends StatefulComponent {
  @State() tooltip = new Tooltip({ openDelay: 0, closeDelay: 0 });

  onBeforeMount() {
    this.tooltip.onBeforeMount?.();
  }

  render() {
    return (
      <div class="demo-wrapper">
        <style>{SHARED_STYLES}</style>
        <p style="color:#6b7280;font-size:0.875rem;margin:0 0 24px">
          A disabled button cannot receive pointer events. Wrap it in a{" "}
          <code>&lt;span&gt;</code> so the tooltip trigger can still handle
          hover events.
        </p>
        <div class="demo-row">
          <div class="demo-col">
            <span class="demo-label">Disabled with tooltip</span>
            <TooltipTrigger tooltip={this.tooltip}>
              {/* span wrapper so hover events work despite button being disabled */}
              <span style="display:inline-block;cursor:not-allowed">
                <button class="morphos-button morphos-button--outline" type="button" disabled>
                  Upgrade to Pro
                </button>
              </span>
            </TooltipTrigger>
            <TooltipContent tooltip={this.tooltip} class="morphos-tooltip-content">
              Available on Pro plan
            </TooltipContent>
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
  title: "Overlays/Tooltip",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => <TooltipDefaultDemo />,
};

export const Positions: Story = {
  name: "Positions",
  render: () => <TooltipPositionsDemo />,
};

export const Disabled: Story = {
  name: "Disabled Button",
  render: () => <TooltipDisabledDemo />,
};
