import type { PrimitiveProps } from "@morphos/core";

import type { Field } from "./field";

export interface FieldProps extends PrimitiveProps {
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
}

export interface FieldLabelProps extends PrimitiveProps {
  field: Field;
}

export interface FieldDescriptionProps extends PrimitiveProps {
  field: Field;
  id?: string;
}

export interface FieldErrorProps extends PrimitiveProps {
  field: Field;
  id?: string;
}

export interface FieldControlProps extends PrimitiveProps {
  field: Field;
}
