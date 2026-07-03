import { StatefulComponent } from "@praxisjs/core";
import { Component, Emit, Prop, State } from "@praxisjs/decorators";

import { generateId, Keys } from "@morphos/core";

import type { OtpFieldProps } from "./otp-field.types";

@Component()
export class OtpField extends StatefulComponent {
  @Prop() length = 6;
  @Prop() value?: string;
  @Prop() defaultValue?: string;
  @Prop() onValueChange?: OtpFieldProps["onValueChange"];
  @Prop() onComplete?: OtpFieldProps["onComplete"];
  @Prop() disabled = false;
  @Prop() name?: string;
  @Prop() pattern = "[0-9]";
  @Prop() inputMode: OtpFieldProps["inputMode"] = "numeric";
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() "aria-label"?: string;

  @State() _cells: string[] = [];

  private readonly _baseId = generateId("otp");
  private _inputRefs: Array<HTMLInputElement | null> = [];
  private _pasteCleanups: Array<() => void> = [];

  @Emit("onValueChange")
  private _emitValueChange(value: string) {
    return value;
  }

  @Emit("onComplete")
  private _emitComplete(value: string) {
    return value;
  }

  onBeforeMount() {
    const source = this.value ?? this.defaultValue ?? "";
    this._cells = Array.from({ length: this.length }, (_, i) => source[i] ?? "");
  }

  onMount() {
    this._inputRefs.forEach((input, i) => {
      if (!input) return;
      const handler = (e: Event) => { this._handlePaste(i, e as ClipboardEvent); };
      input.addEventListener("paste", handler);
      this._pasteCleanups.push(() => { input.removeEventListener("paste", handler); });
    });
  }

  onUnmount() {
    this._pasteCleanups.forEach((cleanup) => { cleanup(); });
    this._pasteCleanups = [];
  }

  private _getCells(): string[] {
    const value = this.value;
    if (value !== undefined) {
      return Array.from({ length: this.length }, (_, i) => value[i] ?? "");
    }
    return this._cells;
  }

  private _notifyChange(cells: string[]) {
    const val = cells.join("");
    this._emitValueChange(val);
    if (val.length === this.length && !cells.includes("")) {
      this._emitComplete(val);
    }
  }

  private readonly _handleInput = (index: number, e: Event) => {
    const target = e.target as HTMLInputElement;
    const char = target.value.slice(-1);
    const next = [...this._getCells()];
    next[index] = char;
    if (this.value === undefined) this._cells = next;
    if (char && index < this.length - 1) {
      this._inputRefs[index + 1]?.focus();
    }
    this._notifyChange(next);
  };

  private readonly _handleKeyDown = (index: number, e: KeyboardEvent) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const cells = this._getCells();
      if (cells[index]) {
        const next = [...cells];
        next[index] = "";
        if (this.value === undefined) this._cells = next;
        this._notifyChange(next);
      } else if (index > 0) {
        const next = [...cells];
        next[index - 1] = "";
        if (this.value === undefined) this._cells = next;
        this._notifyChange(next);
        this._inputRefs[index - 1]?.focus();
      }
    } else if (e.key === Keys.ArrowLeft) {
      e.preventDefault();
      if (index > 0) this._inputRefs[index - 1]?.focus();
    } else if (e.key === Keys.ArrowRight) {
      e.preventDefault();
      if (index < this.length - 1) this._inputRefs[index + 1]?.focus();
    }
  };

  private readonly _handlePaste = (index: number, e: ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData?.getData("text") ?? "";
    if (!text) return;
    const next = [...this._getCells()];
    for (let i = 0; i < text.length && index + i < this.length; i++) {
      next[index + i] = text[i];
    }
    if (this.value === undefined) this._cells = next;
    this._notifyChange(next);
    const focusIndex = Math.min(index + text.length, this.length - 1);
    this._inputRefs[focusIndex]?.focus();
  };

  render() {
    const ariaLabel = this["aria-label"];

    return (
      <div
        id={this.id}
        class={this.class}
        role="group"
        aria-label={ariaLabel}
        data-disabled={this.disabled ? "" : undefined}
      >
        {this.name && (
          <input
            type="hidden"
            name={this.name}
            value={() => this._getCells().join("")}
          />
        )}
        {Array.from({ length: this.length }, (_, i) => (
          <input
            key={String(i)}
            id={`${this.id ?? this._baseId}-${String(i)}`}
            type="text"
            inputMode={this.inputMode}
            maxLength={1}
            value={() => this._getCells()[i]}
            pattern={this.pattern}
            disabled={this.disabled}
            aria-label={`Digit ${String(i + 1)} of ${String(this.length)}`}
            data-index={String(i)}
            ref={(el: HTMLInputElement | null) => { this._inputRefs[i] = el; }}
            onInput={(e: Event) => { this._handleInput(i, e); }}
            onKeyDown={(e: KeyboardEvent) => { this._handleKeyDown(i, e); }}
          />
        ))}
      </div>
    );
  }
}
