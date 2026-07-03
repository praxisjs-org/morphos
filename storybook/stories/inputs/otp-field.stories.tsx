import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { OtpField } from "@morphos/inputs";

const meta: Meta = {
  title: "Inputs/OtpField",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "One-time password input composed of individual digit cells. Handles keyboard navigation, paste, and auto-advance. Fires `onComplete` when all cells are filled. Styled here with the `@morphos/styles` `morphos-otp-field` recipe.",
      },
    },
  },
};
export default meta;

type Story = StoryObj;

@Component()
class DefaultOtpDemo extends StatefulComponent {
  @State() value = "";
  @State() complete = false;

  onBeforeMount() {
    this.value = "";
    this.complete = false;
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px">
        <p style="margin:0 0 12px;font-size:.875rem;font-weight:500;color:#374151">
          Enter the 6-digit code sent to your phone
        </p>
        <OtpField
          class="morphos-otp-field"
          length={6}
          onValueChange={(val: string) => { this.value = val; this.complete = false; }}
          onComplete={(val: string) => { this.complete = true; }}
          inputMode="numeric"
          pattern="[0-9]"
          aria-label="6-digit verification code"
        />
        <p style="margin:10px 0 0;font-size:.75rem;color:#6b7280;font-family:monospace">
          value: "{() => this.value}" ({() => this.value.length}/6)
        </p>
        {() =>
          this.complete && (
            <p style="margin:8px 0 0;font-size:.8125rem;color:#166534;background:#dcfce7;display:inline-block;padding:4px 12px;border-radius:9999px;font-weight:600">
              Verified — code: {this.value}
            </p>
          )
        }
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultOtpDemo />,
};

@Component()
class FourDigitDemo extends StatefulComponent {
  @State() value = "";

  onBeforeMount() {
    this.value = "";
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px">
        <p style="margin:0 0 12px;font-size:.875rem;font-weight:500;color:#374151">
          Enter your 4-digit PIN
        </p>
        <OtpField
          class="morphos-otp-field"
          length={4}
          onValueChange={(val: string) => { this.value = val; }}
          inputMode="numeric"
          pattern="[0-9]"
          aria-label="4-digit PIN"
        />
        <p style="margin:10px 0 0;font-size:.75rem;color:#6b7280;font-family:monospace">
          length=4 | value: "{() => this.value}"
        </p>
      </div>
    );
  }
}

export const FourDigit: Story = {
  name: "Four Digit",
  render: () => <FourDigitDemo />,
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => (
    <div style="font-family:sans-serif;padding:24px">
      <p style="margin:0 0 12px;font-size:.875rem;font-weight:500;color:#374151">
        Verification code (disabled)
      </p>
      <OtpField
        class="morphos-otp-field"
        length={6}
        defaultValue="123456"
        disabled
        aria-label="Disabled verification code"
      />
      <p style="margin:10px 0 0;font-size:.75rem;color:#6b7280;font-family:monospace">
        data-disabled="" — pre-filled with "123456", non-interactive
      </p>
    </div>
  ),
};
