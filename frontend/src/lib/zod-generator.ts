import { z } from "zod";
import type { FormFieldSchema } from "../types/schema";

export function createZodSchema(fields: FormFieldSchema[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let validator: z.ZodTypeAny;

    switch (field.type) {
      case "number": {
        let numValidator = z.number();
        const rules = field.validation;
        if (rules?.min !== undefined)
          numValidator = numValidator.min(
            rules.min,
            `Min value is ${rules.min}`
          );
        if (rules?.max !== undefined)
          numValidator = numValidator.max(
            rules.max,
            `Max value is ${rules.max}`
          );
        validator = numValidator;
        break;
      }

      case "switch": {
        validator = z.boolean();
        break;
      }

      case "multi-select": {
        let arrValidator = z.array(z.string());
        const rules = field.validation;
        if (rules?.minSelected)
          arrValidator = arrValidator.min(
            rules.minSelected,
            `Select at least ${rules.minSelected}`
          );
        if (rules?.maxSelected)
          arrValidator = arrValidator.max(
            rules.maxSelected,
            `Select at most ${rules.maxSelected}`
          );
        validator = arrValidator;
        break;
      }

      case "date": {
        const dateValidator = z.string();
        const rules = field.validation;
        if (rules?.minDate) {
          validator = dateValidator.refine(
            (date) => {
              if (!date) return true;
              return new Date(date) >= new Date(rules.minDate!);
            },
            {
              message: `Date must be after ${rules.minDate}`,
            }
          );
        } else {
          validator = dateValidator;
        }
        break;
      }

      default: {
        // text, textarea, select, email
        let strValidator = z.string();
        const rules = field.validation;

        if (rules?.minLength)
          strValidator = strValidator.min(
            rules.minLength,
            `Min ${rules.minLength} chars`
          );
        if (rules?.maxLength)
          strValidator = strValidator.max(
            rules.maxLength,
            `Max ${rules.maxLength} chars`
          );
        if (rules?.regex)
          strValidator = strValidator.regex(
            new RegExp(rules.regex),
            "Invalid format"
          );

        validator = strValidator;
        break;
      }
    }

    if (!field.required) {
      validator = validator.optional().or(z.literal(""));
    } else {
      validator = validator.optional().refine(
        (val) => {
          if (val === undefined || val === null) return false;
          if (typeof val === "string" && val.trim() === "") return false;
          if (Array.isArray(val) && val.length === 0) return false;

          return true;
        },
        {
          message: "This field is required",
        }
      );
    }

    shape[field.name] = validator;
  });

  return z.object(shape);
}
