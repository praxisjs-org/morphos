import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Form } from "@morphos/inputs";

const meta: Meta = {
  title: "Inputs/Form",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Thin wrapper around a native `<form>` element. Provides `onSubmit`, `onReset`, `noValidate`, `method`, and `action` props while retaining full native form behavior including `FormData` and constraint validation. Styled here with the `@morphos/styles` `morphos-form`/`morphos-input`/`morphos-button` recipes.",
      },
    },
  },
};
export default meta;

type Story = StoryObj;

@Component()
class DefaultFormDemo extends StatefulComponent {
  @State() submitCount = 0;
  @State() resetCount = 0;
  @State() lastPayload: Record<string, string> = {};
  @State() showSuccess = false;

  onBeforeMount() {
    this.submitCount = 0;
    this.resetCount = 0;
    this.lastPayload = {};
    this.showSuccess = false;
  }

  handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    this.submitCount += 1;
    this.showSuccess = true;
    const data = new FormData(e.target as HTMLFormElement);
    const payload: Record<string, string> = {};
    data.forEach((val, key) => { payload[key] = String(val); });
    this.lastPayload = payload;
    setTimeout(() => { this.showSuccess = false; }, 3000);
  }

  handleReset() {
    this.resetCount += 1;
    this.lastPayload = {};
    this.showSuccess = false;
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px;max-width:400px">
        <h3 style="margin:0 0 16px;font-size:1rem;color:var(--morphos-color-text)">Log in to your account</h3>
        <Form
          class="morphos-form"
          onSubmit={(e: SubmitEvent) => { this.handleSubmit(e); }}
          onReset={() => { this.handleReset(); }}
          aria-label="Login form"
        >
          <div style="margin-bottom:16px">
            <label style="display:block;font-size:.8125rem;font-weight:500;color:var(--morphos-color-text);margin-bottom:4px" for="frm-email">
              Email address<span style="color:var(--morphos-color-danger);margin-left:2px">*</span>
            </label>
            <input
              class="morphos-input"
              type="email"
              id="frm-email"
              name="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div style="margin-bottom:16px">
            <label style="display:block;font-size:.8125rem;font-weight:500;color:var(--morphos-color-text);margin-bottom:4px" for="frm-password">
              Password<span style="color:var(--morphos-color-danger);margin-left:2px">*</span>
            </label>
            <input
              class="morphos-input"
              type="password"
              id="frm-password"
              name="password"
              required
              placeholder="Min. 8 characters"
              minLength={8}
            />
          </div>
          <div style="display:flex;gap:8px;margin-top:20px">
            <button type="submit" class="morphos-button">Sign in</button>
            <button type="reset" class="morphos-button morphos-button--outline">Clear</button>
          </div>
        </Form>

        {() =>
          this.showSuccess && (
            <div style="margin-top:12px;padding:10px 14px;background:var(--morphos-color-success-bg);color:var(--morphos-color-text);border-radius:6px;font-size:.8125rem;font-weight:500">Submitted — check the payload below.</div>
          )
        }

        <div style="margin-top:10px;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace;background:var(--morphos-color-bg-subtle);padding:6px 10px;border-radius:4px">
          onSubmit: {() => this.submitCount}x | onReset: {() => this.resetCount}x
        </div>

        {() =>
          Object.keys(this.lastPayload).length > 0 && (
            <div style="margin-top:8px;padding:10px;border:1px solid var(--morphos-color-border);border-radius:6px;background:var(--morphos-color-bg-subtle)">
              <div style="font-size:.75rem;font-weight:600;color:var(--morphos-color-text);margin-bottom:6px">Last payload:</div>
              <pre style="font-size:.75rem;font-family:monospace;white-space:pre-wrap;color:var(--morphos-color-text);margin:0">{() => JSON.stringify(this.lastPayload, null, 2)}</pre>
            </div>
          )
        }
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultFormDemo />,
};

@Component()
class WithValidationDemo extends StatefulComponent {
  @State() submitted = false;
  @State() error = "";

  onBeforeMount() {
    this.submitted = false;
    this.error = "";
  }

  handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    this.submitted = true;
    this.error = "";
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px;max-width:400px">
        <h3 style="margin:0 0 16px;font-size:1rem;color:var(--morphos-color-text)">Create account</h3>
        <Form
          class="morphos-form"
          onSubmit={(e: SubmitEvent) => { this.handleSubmit(e); }}
          aria-label="Registration form with HTML5 validation"
        >
          <div style="margin-bottom:16px">
            <label style="display:block;font-size:.8125rem;font-weight:500;color:var(--morphos-color-text);margin-bottom:4px" for="reg-name">
              Full name<span style="color:var(--morphos-color-danger);margin-left:2px">*</span>
            </label>
            <input
              class="morphos-input"
              type="text"
              id="reg-name"
              name="name"
              required
              minLength={2}
              placeholder="Full Name"
              autoComplete="name"
            />
          </div>
          <div style="margin-bottom:16px">
            <label style="display:block;font-size:.8125rem;font-weight:500;color:var(--morphos-color-text);margin-bottom:4px" for="reg-email">
              Email address<span style="color:var(--morphos-color-danger);margin-left:2px">*</span>
            </label>
            <input
              class="morphos-input"
              type="email"
              id="reg-email"
              name="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div style="margin-bottom:16px">
            <label style="display:block;font-size:.8125rem;font-weight:500;color:var(--morphos-color-text);margin-bottom:4px" for="reg-url">Website</label>
            <input
              class="morphos-input"
              type="url"
              id="reg-url"
              name="website"
              placeholder="https://example.com"
              autoComplete="url"
            />
          </div>
          <div style="display:flex;gap:8px;margin-top:20px">
            <button type="submit" class="morphos-button">Create account</button>
          </div>
        </Form>

        {() =>
          this.submitted && (
            <div style="margin-top:12px;padding:10px 14px;background:var(--morphos-color-success-bg);color:var(--morphos-color-text);border-radius:6px;font-size:.8125rem;font-weight:500">Account created — HTML5 validation passed.</div>
          )
        }

        <div style="margin-top:10px;font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace;background:var(--morphos-color-bg-subtle);padding:6px 10px;border-radius:4px">
          noValidate=false — browser constraint validation active (submit with empty fields to see)
        </div>
      </div>
    );
  }
}

export const WithValidation: Story = {
  name: "With Validation",
  render: () => <WithValidationDemo />,
};
