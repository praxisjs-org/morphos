import { StatefulComponent } from "@praxisjs/core";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Checkbox } from "@morphos/inputs";

const meta: Meta = {
  title: "Inputs/Checkbox",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Accessible checkbox primitive. Supports controlled and uncontrolled modes, indeterminate state, and exposes `data-checked`, `data-indeterminate`, and `data-disabled` attributes for CSS styling. Styled here with the `@morphos/styles` `morphos-checkbox` recipe.",
      },
    },
  },
  argTypes: {
    disabled: { control: "boolean" },
    defaultChecked: { control: "boolean" },
  },
  args: {
    disabled: false,
    defaultChecked: false,
  },
};
export default meta;

type Story = StoryObj<{ disabled: boolean; defaultChecked: boolean }>;

@Component()
class DefaultCheckboxDemo extends StatefulComponent {
  @Prop() disabled = false;
  @Prop() defaultChecked = false;
  @State() isChecked = false;

  onBeforeMount() {
    this.isChecked = this.defaultChecked;
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <Checkbox
            id="cb-default"
            class="morphos-checkbox"
            disabled={this.disabled}
            defaultChecked={this.defaultChecked}
            onCheckedChange={(val: boolean) => {
              this.isChecked = val;
            }}
          />
          <label style="font-size:.875rem;color:var(--morphos-color-text);cursor:pointer" for="cb-default">
            Accept terms and conditions
          </label>
        </div>
        <div style="font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace;background:var(--morphos-color-bg-subtle);padding:5px 10px;border-radius:4px;margin-top:6px">
          data-checked={`"${String(this.isChecked)}"`} | data-disabled=
          {`"${String(this.disabled)}"`}
        </div>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: (args) => (
    <DefaultCheckboxDemo
      disabled={args.disabled}
      defaultChecked={args.defaultChecked}
    />
  ),
};

@Component()
class IndeterminateDemo extends StatefulComponent {
  @State() a = true;
  @State() b = false;
  @State() c = false;

  onBeforeMount() {
    this.a = true;
    this.b = false;
    this.c = false;
  }

  private get _allChecked(): boolean {
    return this.a && this.b && this.c;
  }

  private get _noneChecked(): boolean {
    return !this.a && !this.b && !this.c;
  }

  private get _isPartial(): boolean {
    return !this._allChecked && !this._noneChecked;
  }

  private _toggleAll(checked: boolean) {
    this.a = checked;
    this.b = checked;
    this.c = checked;
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <Checkbox
            id="cb-select-all"
            class="morphos-checkbox"
            checked={() => this._allChecked}
            indeterminate={() => this._isPartial}
            onCheckedChange={(val: boolean) => { this._toggleAll(val); }}
            aria-label="Select all fruits"
          />
          <label style="font-size:.875rem;color:var(--morphos-color-text);cursor:pointer" for="cb-select-all">
            <strong>Select all</strong>
          </label>
        </div>
        <div style="margin-left:26px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <Checkbox
              id="cb-child-a"
              class="morphos-checkbox"
              checked={() => this.a}
              onCheckedChange={(val: boolean) => { this.a = val; }}
              aria-label="Apple"
            />
            <label style="font-size:.875rem;color:var(--morphos-color-text);cursor:pointer" for="cb-child-a">Apple</label>
          </div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <Checkbox
              id="cb-child-b"
              class="morphos-checkbox"
              checked={() => this.b}
              onCheckedChange={(val: boolean) => { this.b = val; }}
              aria-label="Banana"
            />
            <label style="font-size:.875rem;color:var(--morphos-color-text);cursor:pointer" for="cb-child-b">Banana</label>
          </div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <Checkbox
              id="cb-child-c"
              class="morphos-checkbox"
              checked={() => this.c}
              onCheckedChange={(val: boolean) => { this.c = val; }}
              aria-label="Cherry"
            />
            <label style="font-size:.875rem;color:var(--morphos-color-text);cursor:pointer" for="cb-child-c">Cherry</label>
          </div>
        </div>
        <div style="font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace;background:var(--morphos-color-bg-subtle);padding:5px 10px;border-radius:4px;margin-top:6px">
          Checking/unchecking a child recomputes the parent's{" "}
          <code>indeterminate</code> prop — pass it as a function
          (<code>{"indeterminate={() => ...}"}</code>) so the reactive update
          reaches the checkbox; a static <code>true</code> only sets the
          native indeterminate state once, and clicking the box clears it
          natively without anything to restore it.
        </div>
      </div>
    );
  }
}

export const Indeterminate: Story = {
  name: "Indeterminate",
  render: () => <IndeterminateDemo />,
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => (
    <div style="font-family:sans-serif;padding:24px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <Checkbox
          id="cb-dis-unchecked"
          class="morphos-checkbox"
          disabled
          aria-label="Disabled unchecked"
        />
        <label style="font-size:.875rem;color:var(--morphos-color-text);cursor:pointer;opacity:0.5" for="cb-dis-unchecked">
          Disabled (unchecked)
        </label>
      </div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <Checkbox
          id="cb-dis-checked"
          class="morphos-checkbox"
          disabled
          defaultChecked={true}
          aria-label="Disabled checked"
        />
        <label style="font-size:.875rem;color:var(--morphos-color-text);cursor:pointer;opacity:0.5" for="cb-dis-checked">
          Disabled (checked)
        </label>
      </div>
      <div style="font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace;background:var(--morphos-color-bg-subtle);padding:5px 10px;border-radius:4px;margin-top:6px">data-disabled="" | pointer-events: none</div>
    </div>
  ),
};

@Component()
class ControlledCheckboxDemo extends StatefulComponent {
  @State() externalChecked = false;

  onBeforeMount() {
    this.externalChecked = false;
  }

  render() {
    return (
      <div style="font-family:sans-serif;padding:24px">
        <p style="margin:0 0 12px;font-size:.875rem;color:var(--morphos-color-text)">
          External state:{" "}
          <strong>{() => (this.externalChecked ? "checked" : "unchecked")}</strong>
        </p>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <Checkbox
            id="cb-controlled"
            class="morphos-checkbox"
            checked={() => this.externalChecked}
            onCheckedChange={(val: boolean) => {
              this.externalChecked = val;
            }}
            aria-label="Controlled checkbox"
          />
          <label style="font-size:.875rem;color:var(--morphos-color-text);cursor:pointer" for="cb-controlled">
            Controlled checkbox
          </label>
        </div>
        <div style="margin-top:12px;display:flex;gap:8px">
          <button
            class="morphos-button"
            onClick={() => {
              this.externalChecked = true;
            }}
          >
            Check
          </button>
          <button
            class="morphos-button morphos-button--outline"
            onClick={() => {
              this.externalChecked = false;
            }}
          >
            Uncheck
          </button>
        </div>
        <div style="font-size:.75rem;color:var(--morphos-color-text-muted);font-family:monospace;background:var(--morphos-color-bg-subtle);padding:5px 10px;border-radius:4px;margin-top:6px">
          checked={`{${String(this.externalChecked)}}`} — controlled via prop
        </div>
      </div>
    );
  }
}

export const Controlled: Story = {
  name: "Controlled",
  render: () => <ControlledCheckboxDemo />,
};
