import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Prop, State } from "@praxisjs/decorators";

import { generateId } from "@morphos/core";

import type { FieldControlProps, FieldDescriptionProps, FieldErrorProps, FieldLabelProps, FieldProps } from "./field.types";

@Component()
export class Field extends StatefulComponent {
  @Prop() invalid = false;
  @Prop() disabled = false;
  @Prop() required = false;
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: FieldProps["children"];

  @State() _fieldId = "";
  @State() descriptionId = "";
  @State() errorId = "";

  onBeforeMount() {
    this._fieldId = generateId("field");
    this.descriptionId = generateId("field-desc");
    this.errorId = generateId("field-error");
  }

  get fieldId(): string {
    return this.id ?? this._fieldId;
  }

  render() {
    return (
      <div
        class={this.class}
        data-invalid={this.invalid ? "" : undefined}
        data-disabled={this.disabled ? "" : undefined}
        data-required={this.required ? "" : undefined}
      >
        {this.children}
      </div>
    );
  }
}

@Component()
export class FieldLabel extends StatelessComponent<FieldLabelProps> {
  render() {
    const { field, children, class: cls, id } = this.props;

    return (
      <label
        id={id}
        class={cls}
        htmlFor={field.fieldId}
      >
        {children}
      </label>
    );
  }
}

@Component()
export class FieldDescription extends StatelessComponent<FieldDescriptionProps> {
  render() {
    const { field, id, children, class: cls } = this.props;

    return (
      <p
        id={id ?? field.descriptionId}
        class={cls}
      >
        {children}
      </p>
    );
  }
}

@Component()
export class FieldError extends StatelessComponent<FieldErrorProps> {
  render() {
    const { field, id, children, class: cls } = this.props;

    return (
      <div style={{ display: "contents" }}>
        {() =>
          field.invalid && (
            <p
              id={id ?? field.errorId}
              role="alert"
              class={cls}
            >
              {children}
            </p>
          )
        }
      </div>
    );
  }
}

@Component()
export class FieldControl extends StatelessComponent<FieldControlProps> {
  render() {
    const { children, class: cls } = this.props;

    return (
      <div class={cls}>
        {children}
      </div>
    );
  }
}
