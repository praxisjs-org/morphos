import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Avatar, AvatarFallback, AvatarImage } from "@morphos/feedback";

// ---------------------------------------------------------------------------
// Shared style block
// ---------------------------------------------------------------------------

const AVATAR_STYLE = `
  .avatar-fallback {
    font-weight: 600;
    text-transform: uppercase;
  }
  .avatar-row {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 14px;
  }
  .avatar-meta {
    font-size: .875rem;
    color: #374151;
    font-family: sans-serif;
  }
  .avatar-meta small {
    display: block;
    color: #9ca3af;
    font-size: .75rem;
    margin-top: 2px;
  }
  /* size variants */
  .avatar-sm { width: 32px; height: 32px; font-size: .75rem }
  .avatar-md { width: 48px; height: 48px; font-size: .875rem }
  .avatar-lg { width: 72px; height: 72px; font-size: 1.25rem }
`;

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: "Feedback/Avatar",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Compound avatar primitive composed of `Avatar`, `AvatarImage`, and `AvatarFallback`. " +
          "The root tracks image load state via `data-status` (`idle → loading → loaded | error`). " +
          "The fallback uses the native `hidden` attribute — no JS class toggling required. Styled here with the `@morphos/styles` `morphos-avatar` recipe.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

// ---------------------------------------------------------------------------
// WithImage — real image URLs, fallback ready
// ---------------------------------------------------------------------------

@Component()
class WithImageDemo extends StatefulComponent {
  @State() a1 = new Avatar();
  @State() a2 = new Avatar();

  onBeforeMount() {
    this.a1.onBeforeMount?.();
    this.a2.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;max-width:360px">
        <style>{AVATAR_STYLE}</style>

        <div class="avatar-row">
          <Avatar class="morphos-avatar avatar-md">
            <AvatarImage class="morphos-avatar-image" avatar={this.a1} src="https://i.pravatar.cc/96?img=3" alt="User A" />
            <AvatarFallback avatar={this.a1} class="morphos-avatar-fallback avatar-fallback">UA</AvatarFallback>
          </Avatar>
          <div class="avatar-meta">
            User A
            <small>Status: {() => this.a1._imageStatus}</small>
          </div>
        </div>

        <div class="avatar-row">
          <Avatar class="morphos-avatar avatar-md">
            <AvatarImage class="morphos-avatar-image" avatar={this.a2} src="https://i.pravatar.cc/96?img=47" alt="User B" />
            <AvatarFallback avatar={this.a2} class="morphos-avatar-fallback avatar-fallback">UB</AvatarFallback>
          </Avatar>
          <div class="avatar-meta">
            User B
            <small>Status: {() => this.a2._imageStatus}</small>
          </div>
        </div>
      </div>
    );
  }
}

export const WithImage: Story = {
  name: "With image",
  render: () => <WithImageDemo />,
};

// ---------------------------------------------------------------------------
// WithFallback — broken URL forces fallback to initials
// ---------------------------------------------------------------------------

@Component()
class WithFallbackDemo extends StatefulComponent {
  @State() a1 = new Avatar();
  @State() a2 = new Avatar();

  onBeforeMount() {
    this.a1.onBeforeMount?.();
    this.a2.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;max-width:360px">
        <style>{AVATAR_STYLE}</style>

        <div class="avatar-row">
          <Avatar class="morphos-avatar avatar-md">
            <AvatarImage
              class="morphos-avatar-image"
              avatar={this.a1}
              src="https://broken.invalid/img.jpg"
              alt="User C"
            />
            <AvatarFallback avatar={this.a1} class="morphos-avatar-fallback avatar-fallback">UC</AvatarFallback>
          </Avatar>
          <div class="avatar-meta">
            User C
            <small>Status: {() => this.a1._imageStatus} — broken URL, shows initials</small>
          </div>
        </div>

        <div class="avatar-row">
          <Avatar class="morphos-avatar avatar-md">
            <AvatarImage
              class="morphos-avatar-image"
              avatar={this.a2}
              src="https://broken.invalid/img2.jpg"
              alt="User D"
            />
            <AvatarFallback avatar={this.a2} class="morphos-avatar-fallback avatar-fallback">UD</AvatarFallback>
          </Avatar>
          <div class="avatar-meta">
            User D
            <small>Status: {() => this.a2._imageStatus} — broken URL, shows initials</small>
          </div>
        </div>

        <div style="margin-top:12px;padding:10px 14px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;font-size:.78rem;color:#0369a1">
          <strong>How it works:</strong> <code>AvatarImage</code> fires <code>onError</code> when
          the URL is unreachable. The root <code>Avatar</code> sets <code>data-status="error"</code>
          and <code>AvatarFallback</code> removes its <code>hidden</code> attribute.
        </div>
      </div>
    );
  }
}

export const WithFallback: Story = {
  name: "With fallback",
  render: () => <WithFallbackDemo />,
};

// ---------------------------------------------------------------------------
// Sizes — small / default / large via CSS class
// ---------------------------------------------------------------------------

@Component()
class SizesDemo extends StatefulComponent {
  @State() sm = new Avatar();
  @State() md = new Avatar();
  @State() lg = new Avatar();

  onBeforeMount() {
    this.sm.onBeforeMount?.();
    this.md.onBeforeMount?.();
    this.lg.onBeforeMount?.();
  }

  render() {
    return (
      <div style="font-family:sans-serif;max-width:360px">
        <style>{AVATAR_STYLE}</style>

        <div class="avatar-row" style="align-items:flex-end">
          <div style="text-align:center">
            <Avatar class="morphos-avatar avatar-sm">
              <AvatarImage class="morphos-avatar-image" avatar={this.sm} src="https://i.pravatar.cc/96?img=12" alt="Small avatar" />
              <AvatarFallback avatar={this.sm} class="morphos-avatar-fallback avatar-fallback">SM</AvatarFallback>
            </Avatar>
            <div style="font-size:.75rem;color:#9ca3af;margin-top:6px">32 px</div>
          </div>

          <div style="text-align:center">
            <Avatar class="morphos-avatar avatar-md">
              <AvatarImage class="morphos-avatar-image" avatar={this.md} src="https://i.pravatar.cc/96?img=12" alt="Medium avatar" />
              <AvatarFallback avatar={this.md} class="morphos-avatar-fallback avatar-fallback">MD</AvatarFallback>
            </Avatar>
            <div style="font-size:.75rem;color:#9ca3af;margin-top:6px">48 px</div>
          </div>

          <div style="text-align:center">
            <Avatar class="morphos-avatar avatar-lg">
              <AvatarImage class="morphos-avatar-image" avatar={this.lg} src="https://i.pravatar.cc/96?img=12" alt="Large avatar" />
              <AvatarFallback avatar={this.lg} class="morphos-avatar-fallback avatar-fallback">LG</AvatarFallback>
            </Avatar>
            <div style="font-size:.75rem;color:#9ca3af;margin-top:6px">72 px</div>
          </div>
        </div>

        <div style="margin-top:8px;padding:10px 14px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;font-size:.78rem;color:#0369a1">
          Sizes are applied via CSS classes (<code>.avatar-sm</code>, <code>.avatar-md</code>,
          <code>.avatar-lg</code>) on the <code>Avatar</code> root. The image and fallback inherit
          dimensions from the container.
        </div>
      </div>
    );
  }
}

export const Sizes: Story = {
  name: "Sizes",
  render: () => <SizesDemo />,
};
