// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@praxisjs/runtime";

import { Field, FieldControl, FieldDescription, FieldError, FieldLabel } from "../field/field";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("Field", () => {
  it("generates a fieldId when none is provided", () => {
    const field = new Field();
    field.onBeforeMount?.();
    expect(field.fieldId).toMatch(/^field-/);
    expect(field.descriptionId).toMatch(/^field-desc-/);
    expect(field.errorId).toMatch(/^field-error-/);
  });

  it("prefers an explicit id over the generated one", () => {
    const field = new Field({ id: "custom-id" });
    field.onBeforeMount?.();
    expect(field.fieldId).toBe("custom-id");
  });

  it("renders data-* attributes for invalid/disabled/required", () => {
    const container = mount(() => (
      <Field invalid disabled required class="f">
        <span>child</span>
      </Field>
    ));
    const div = container.querySelector("div");
    expect(div?.getAttribute("data-invalid")).toBe("");
    expect(div?.getAttribute("data-disabled")).toBe("");
    expect(div?.getAttribute("data-required")).toBe("");
    expect(div?.className).toBe("f");
    expect(div?.querySelector("span")?.textContent).toBe("child");
  });

  it("omits data-* attributes by default", () => {
    const container = mount(() => <Field>x</Field>);
    const div = container.querySelector("div");
    expect(div?.hasAttribute("data-invalid")).toBe(false);
    expect(div?.hasAttribute("data-disabled")).toBe(false);
    expect(div?.hasAttribute("data-required")).toBe(false);
  });
});

describe("FieldLabel", () => {
  it("associates with the field via htmlFor", () => {
    const field = new Field({ id: "f-1" });
    field.onBeforeMount?.();
    const container = mount(() => (
      <FieldLabel field={field} id="lbl-1" class="lbl">
        Name
      </FieldLabel>
    ));
    const label = container.querySelector("label");
    expect(label?.id).toBe("lbl-1");
    expect(label?.className).toBe("lbl");
    expect(label?.getAttribute("for")).toBe("f-1");
    expect(label?.textContent).toBe("Name");
  });
});

describe("FieldDescription", () => {
  it("uses field.descriptionId when no id is provided", () => {
    const field = new Field();
    field.onBeforeMount?.();
    const container = mount(() => <FieldDescription field={field}>Help text</FieldDescription>);
    const p = container.querySelector("p");
    expect(p?.id).toBe(field.descriptionId);
    expect(p?.textContent).toBe("Help text");
  });

  it("prefers an explicit id", () => {
    const field = new Field();
    field.onBeforeMount?.();
    const container = mount(() => (
      <FieldDescription field={field} id="desc-x" class="d">
        Help
      </FieldDescription>
    ));
    const p = container.querySelector("p");
    expect(p?.id).toBe("desc-x");
    expect(p?.className).toBe("d");
  });
});

describe("FieldError", () => {
  it("renders nothing when the field is valid", () => {
    const field = new Field();
    field.onBeforeMount?.();
    const container = mount(() => <FieldError field={field}>Required</FieldError>);
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });

  it("renders the error message when the field is invalid", () => {
    const field = new Field({ invalid: true });
    field.onBeforeMount?.();
    const container = mount(() => (
      <FieldError field={field} id="err-1" class="e">
        Required
      </FieldError>
    ));
    const alert = container.querySelector('[role="alert"]');
    expect(alert?.id).toBe("err-1");
    expect(alert?.className).toBe("e");
    expect(alert?.textContent).toBe("Required");
  });

  it("uses field.errorId when no id is provided", () => {
    const field = new Field({ invalid: true });
    field.onBeforeMount?.();
    const container = mount(() => <FieldError field={field}>Required</FieldError>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert?.id).toBe(field.errorId);
  });
});

describe("FieldControl", () => {
  it("renders children inside a div with class", () => {
    const container = mount(() => (
      <FieldControl class="ctrl">
        <input />
      </FieldControl>
    ));
    const div = container.querySelector("div.ctrl");
    expect(div?.querySelector("input")).toBeTruthy();
  });
});
