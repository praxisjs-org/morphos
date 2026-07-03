import { StatefulComponent } from "@praxisjs/core";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { PreviewCard, PreviewCardContent, PreviewCardTrigger } from "@morphos/overlays";

const CARD_STYLE = `
  .preview-trigger {
    display:inline-flex;align-items:center;gap:5px;
    color:#4f46e5;text-decoration:underline;text-decoration-style:dotted;
    text-underline-offset:3px;cursor:pointer;font-size:14px;
    background:none;border:none;padding:0;font-family:sans-serif;
  }
  .preview-trigger[data-open] { color:#4338ca; }
  .pv-hero {
    width:100%;height:130px;display:flex;align-items:center;
    justify-content:center;font-size:44px;
  }
  .pv-body { padding:14px; }
  .pv-title { font-size:14px;font-weight:700;color:#111827;margin:0 0 4px; }
  .pv-desc { font-size:12px;color:#6b7280;line-height:1.5;margin:0 0 10px; }
  .pv-meta { display:flex;align-items:center;gap:8px; }
  .pv-avatar { width:22px;height:22px;border-radius:50%;background:#eef2ff;display:flex;align-items:center;justify-content:center;font-size:12px; }
  .pv-author { font-size:12px;color:#9ca3af; }
  .pv-tag { margin-left:auto;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:500; }
  .pv-tag-green { background:#f0fdf4;color:#16a34a; }
  .pv-tag-blue { background:#eff6ff;color:#2563eb; }
  .demo-label { font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;margin:0 0 14px;font-family:sans-serif; }
`;

// ---------- Default ----------

interface DefaultArgs {
  openDelay: number;
  closeDelay: number;
}

@Component()
class DefaultPreviewCardDemo extends StatefulComponent {
  @Prop() openDelay?: number;
  @Prop() closeDelay?: number;
  @State() card = new PreviewCard({ openDelay: 300, closeDelay: 100 });

  onBeforeMount() {
    this.card = new PreviewCard({
      openDelay: this.openDelay ?? 300,
      closeDelay: this.closeDelay ?? 100,
    });
    this.card.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:32px">
        <style>{CARD_STYLE}</style>
        <p class="demo-label">Hover over the trigger to see the preview</p>
        <p style="font-size:15px;color:#374151;line-height:1.8;margin:0">
          The{" "}
          <PreviewCardTrigger card={this.card} class="preview-trigger">
            Morphos component library
          </PreviewCardTrigger>
          {" "}is a headless primitive set for PraxisJS.
        </p>
        <PreviewCardContent card={this.card} class="morphos-preview-card-content">
          <div class="pv-hero" style="background:linear-gradient(135deg,#667eea,#764ba2)">📦</div>
          <div class="pv-body">
            <p class="pv-title">Morphos Component Library</p>
            <p class="pv-desc">
              A headless, accessible component library for PraxisJS. Zero styles, full control.
            </p>
            <div class="pv-meta">
              <div class="pv-avatar">⭐</div>
              <span class="pv-author">4.2k stars · MIT License</span>
              <span class="pv-tag pv-tag-green">Open source</span>
            </div>
          </div>
        </PreviewCardContent>
        <p style="margin:16px 0 0;font-size:12px;font-family:monospace;color:#9ca3af">
          openDelay={String(this.openDelay ?? 300)}ms | closeDelay={String(this.closeDelay ?? 100)}ms
        </p>
      </div>
    );
  }
}

// ---------- UserProfile ----------

@Component()
class UserProfilePreviewDemo extends StatefulComponent {
  @State() card = new PreviewCard({ openDelay: 400, closeDelay: 150 });

  onBeforeMount() {
    this.card.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:32px">
        <style>{CARD_STYLE + `
          .up-card { display:flex;align-items:center;gap:12px;padding:16px; }
          .up-avatar { width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px;flex-shrink:0; }
          .up-name { font-size:14px;font-weight:700;color:#111827; }
          .up-handle { font-size:12px;color:#9ca3af; }
          .up-stats { display:flex;gap:16px;padding:10px 16px 16px;border-top:1px solid #f3f4f6; }
          .up-stat { display:flex;flex-direction:column;align-items:center; }
          .up-stat-val { font-size:15px;font-weight:700;color:#111827; }
          .up-stat-lbl { font-size:11px;color:#9ca3af; }
          .up-bio { font-size:12px;color:#6b7280;line-height:1.5;padding:0 16px 14px; }
        `}</style>
        <p class="demo-label">Hover to reveal a user profile card</p>
        <p style="font-size:15px;color:#374151;line-height:1.8;margin:0">
          Article written by{" "}
          <PreviewCardTrigger card={this.card} class="preview-trigger">
            Author Name
          </PreviewCardTrigger>
          , design engineer.
        </p>
        <PreviewCardContent card={this.card} class="morphos-preview-card-content">
          <div class="up-card">
            <div class="up-avatar">A</div>
            <div>
              <p class="up-name">Author Name</p>
              <p class="up-handle">@author · Design Engineer</p>
            </div>
          </div>
          <p class="up-bio">
            Building accessible UI systems. Open source contributor. Writes about design
            engineering and component architecture.
          </p>
          <div class="up-stats">
            <div class="up-stat">
              <span class="up-stat-val">142</span>
              <span class="up-stat-lbl">Articles</span>
            </div>
            <div class="up-stat">
              <span class="up-stat-val">18.4k</span>
              <span class="up-stat-lbl">Followers</span>
            </div>
            <div class="up-stat">
              <span class="up-stat-val">312</span>
              <span class="up-stat-lbl">Following</span>
            </div>
          </div>
        </PreviewCardContent>
      </div>
    );
  }
}

// ---------- Multiple inline triggers ----------

@Component()
class MultipleCardsDemo extends StatefulComponent {
  @State() card1 = new PreviewCard({ openDelay: 300, closeDelay: 100 });
  @State() card2 = new PreviewCard({ openDelay: 600, closeDelay: 200 });
  @State() card3 = new PreviewCard({ openDelay: 150, closeDelay: 50 });

  onBeforeMount() {
    this.card1.onBeforeMount?.();
    this.card2.onBeforeMount?.();
    this.card3.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:32px">
        <style>{CARD_STYLE}</style>
        <p class="demo-label">Multiple independent hover previews in a paragraph</p>
        <p style="font-size:15px;color:#374151;line-height:1.8;max-width:540px;margin:0">
          This article was written by{" "}
          <PreviewCardTrigger card={this.card2} class="preview-trigger">Author Name</PreviewCardTrigger>
          {" "}and covers patterns introduced in the{" "}
          <PreviewCardTrigger card={this.card1} class="preview-trigger">Morphos component library</PreviewCardTrigger>
          . Concepts are also discussed in the{" "}
          <PreviewCardTrigger card={this.card3} class="preview-trigger">Headless UI Patterns</PreviewCardTrigger>
          {" "}repository.
        </p>

        <PreviewCardContent card={this.card1} class="morphos-preview-card-content">
          <div class="pv-hero" style="background:linear-gradient(135deg,#667eea,#764ba2)">📦</div>
          <div class="pv-body">
            <p class="pv-title">Morphos Component Library</p>
            <p class="pv-desc">A headless, accessible component library for PraxisJS. Zero styles, full control.</p>
            <div class="pv-meta">
              <div class="pv-avatar">⭐</div>
              <span class="pv-author">4.2k stars · MIT License</span>
              <span class="pv-tag pv-tag-green">Open source</span>
            </div>
          </div>
        </PreviewCardContent>

        <PreviewCardContent card={this.card2} class="morphos-preview-card-content">
          <div class="pv-body" style="padding-top:16px">
            <p class="pv-title" style="margin-bottom:6px">Author Name</p>
            <p class="pv-desc">@author · Design Engineer. Building accessible UI systems and component architecture.</p>
            <div class="pv-meta">
              <div class="pv-avatar">A</div>
              <span class="pv-author">18.4k followers</span>
              <span class="pv-tag pv-tag-blue">Author</span>
            </div>
          </div>
        </PreviewCardContent>

        <PreviewCardContent card={this.card3} class="morphos-preview-card-content">
          <div class="pv-hero" style="background:linear-gradient(135deg,#f093fb,#f5576c)">🎨</div>
          <div class="pv-body">
            <p class="pv-title">Headless UI Patterns</p>
            <p class="pv-desc">A curated collection of accessible, unstyled UI patterns for modern frameworks.</p>
            <div class="pv-meta">
              <div class="pv-avatar">🔗</div>
              <span class="pv-author">github.com/headless-ui</span>
              <span class="pv-tag pv-tag-green">New</span>
            </div>
          </div>
        </PreviewCardContent>

        <p style="margin:16px 0 0;font-size:12px;font-family:monospace;color:#9ca3af">
          Each card has its own openDelay: 300ms, 600ms, 150ms respectively.
        </p>
      </div>
    );
  }
}

// ---------- Meta ----------

const meta: Meta<DefaultArgs> = {
  title: "Overlays/PreviewCard",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Hover-triggered rich content previews. Appears after `openDelay` ms and disappears after `closeDelay` ms. Moving the pointer inside the content area keeps it open. Multiple independent cards can coexist on a page.",
      },
    },
  },
  argTypes: {
    openDelay: {
      control: { type: "number", min: 0, max: 2000, step: 50 },
      description: "Milliseconds before the preview opens after hover.",
    },
    closeDelay: {
      control: { type: "number", min: 0, max: 1000, step: 50 },
      description: "Milliseconds before the preview closes after pointer leaves.",
    },
  },
  args: {
    openDelay: 300,
    closeDelay: 100,
  },
};
export default meta;

type Story = StoryObj<DefaultArgs>;

export const Default: Story = {
  name: "Default",
  render: (args) => (
    <DefaultPreviewCardDemo openDelay={args.openDelay} closeDelay={args.closeDelay} />
  ),
};

export const UserProfile: Story = {
  name: "User Profile",
  render: () => <UserProfilePreviewDemo />,
};

export const MultipleCards: Story = {
  name: "Multiple Inline Triggers",
  render: () => <MultipleCardsDemo />,
};
