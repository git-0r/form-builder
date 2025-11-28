import { z } from "zod";

export const generateZodSchema = (schema: any) => {
  const shape: any = {};

  const fields = Array.isArray(schema) ? schema : schema.fields;

  if (!fields || !Array.isArray(fields)) {
    throw new Error(
      "Validator Error: Invalid schema format. Expected an array of fields or an object with a 'fields' property."
    );
  }

  fields.forEach((field: any) => {
    let validator: any;

    switch (field.type) {
      case "number":
        validator = z.number();
        if (field.validation?.min)
          validator = validator.min(field.validation.min);
        if (field.validation?.max)
          validator = validator.max(field.validation.max);
        break;
      case "multi-select":
        validator = z.array(z.string());
        if (field.validation?.minSelected)
          validator = validator.min(field.validation.minSelected);
        if (field.validation?.maxSelected)
          validator = validator.max(field.validation.maxSelected);
        break;
      case "switch":
        validator = z.boolean();
        break;
      default:
        validator = z.string();
        if (field.validation?.minLength)
          validator = validator.min(field.validation.minLength);
        if (field.validation?.maxLength)
          validator = validator.max(field.validation.maxLength);
        if (field.validation?.regex)
          validator = validator.regex(new RegExp(field.validation.regex));

        if (field.type === "date" && field.validation?.minDate) {
          validator = validator.refine(
            (dateStr: string) => {
              return new Date(dateStr) >= new Date(field.validation.minDate);
            },
            { message: `Date must be after ${field.validation.minDate}` }
          );
        }
    }

    if (!field.required) {
      validator = validator.optional().or(z.literal(""));
    }

    shape[field.name] = validator;
  });

  return z.object(shape);
};
