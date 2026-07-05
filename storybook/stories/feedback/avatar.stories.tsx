import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Avatar, AvatarFallback, AvatarImage } from "@morphos/feedback";

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
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
          <Avatar class="morphos-avatar">
            <AvatarImage class="morphos-avatar-image" avatar={this.a1} src="https://i.pravatar.cc/96?img=3" alt="User A" />
            <AvatarFallback avatar={this.a1} class="morphos-avatar-fallback"><span style="font-weight:600;text-transform:uppercase">UA</span></AvatarFallback>
          </Avatar>
          <div style="font-size:.875rem;color:var(--morphos-color-text);font-family:sans-serif">
            User A
            <small style="display:block;color:var(--morphos-color-text-muted);font-size:.75rem;margin-top:2px">Status: {() => this.a1._imageStatus}</small>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
          <Avatar class="morphos-avatar">
            <AvatarImage class="morphos-avatar-image" avatar={this.a2} src="https://i.pravatar.cc/96?img=47" alt="User B" />
            <AvatarFallback avatar={this.a2} class="morphos-avatar-fallback"><span style="font-weight:600;text-transform:uppercase">UB</span></AvatarFallback>
          </Avatar>
          <div style="font-size:.875rem;color:var(--morphos-color-text);font-family:sans-serif">
            User B
            <small style="display:block;color:var(--morphos-color-text-muted);font-size:.75rem;margin-top:2px">Status: {() => this.a2._imageStatus}</small>
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
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
          <Avatar class="morphos-avatar">
            <AvatarImage
              class="morphos-avatar-image"
              avatar={this.a1}
              src="https://broken.invalid/img.jpg"
              alt="User C"
            />
            <AvatarFallback avatar={this.a1} class="morphos-avatar-fallback"><span style="font-weight:600;text-transform:uppercase">UC</span></AvatarFallback>
          </Avatar>
          <div style="font-size:.875rem;color:var(--morphos-color-text);font-family:sans-serif">
            User C
            <small style="display:block;color:var(--morphos-color-text-muted);font-size:.75rem;margin-top:2px">Status: {() => this.a1._imageStatus} — broken URL, shows initials</small>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
          <Avatar class="morphos-avatar">
            <AvatarImage
              class="morphos-avatar-image"
              avatar={this.a2}
              src="https://broken.invalid/img2.jpg"
              alt="User D"
            />
            <AvatarFallback avatar={this.a2} class="morphos-avatar-fallback"><span style="font-weight:600;text-transform:uppercase">UD</span></AvatarFallback>
          </Avatar>
          <div style="font-size:.875rem;color:var(--morphos-color-text);font-family:sans-serif">
            User D
            <small style="display:block;color:var(--morphos-color-text-muted);font-size:.75rem;margin-top:2px">Status: {() => this.a2._imageStatus} — broken URL, shows initials</small>
          </div>
        </div>

        <div style="margin-top:12px;padding:10px 14px;background:var(--morphos-color-info-bg);border:1px solid var(--morphos-color-info);border-radius:6px;font-size:.78rem;color:var(--morphos-color-text)">
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
