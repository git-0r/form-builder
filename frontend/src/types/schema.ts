export interface TextValidation {
  minLength?: number;
  maxLength?: number;
  regex?: string;
}

export interface NumberValidation {
  min?: number;
  max?: number;
}

export interface DateValidation {
  minDate?: string;
}

export interface MultiSelectValidation {
  minSelected?: number;
  maxSelected?: number;
}

interface BaseField {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

export interface TextFieldSchema extends BaseField {
  type: "text" | "textarea" | "select" | "email";
  options?: { value: string; label: string }[]; // 'select' needs options
  validation?: TextValidation;
}

export interface NumberFieldSchema extends BaseField {
  type: "number";
  validation?: NumberValidation;
}

export interface DateFieldSchema extends BaseField {
  type: "date";
  validation?: DateValidation;
}

export interface SwitchFieldSchema extends BaseField {
  type: "switch";
  validation?: never;
}

export interface MultiSelectFieldSchema extends BaseField {
  type: "multi-select";
  options: { value: string; label: string }[];
  validation?: MultiSelectValidation;
}

export type FormFieldSchema =
  | TextFieldSchema
  | NumberFieldSchema
  | DateFieldSchema
  | SwitchFieldSchema
  | MultiSelectFieldSchema;

export interface FormSchema {
  title: string;
  description: string;
  fields: FormFieldSchema[];
}

export type DynamicFormData = Record<string, unknown>;
