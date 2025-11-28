import { useFieldContext } from "./FormContext";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type {
  DateFieldSchema,
  FormFieldSchema,
  MultiSelectFieldSchema,
  NumberFieldSchema,
  SwitchFieldSchema,
  TextFieldSchema,
} from "../../types/schema";

const FieldInfo = ({ schema }: { schema: FormFieldSchema }) => {
  const field = useFieldContext();
  const hasError = field.state.meta.errors.length > 0;

  return (
    <>
      <Label
        htmlFor={schema.name}
        className={`mb-2 ${hasError ? "text-destructive" : ""}`}
      >
        {schema.label}{" "}
        {schema.required && <span className="text-destructive">*</span>}
      </Label>
      {hasError && (
        <p className="text-[0.8rem] font-medium text-destructive mt-1 animate-in slide-in-from-top-1">
          {field.state.meta.errors.join(", ")}
        </p>
      )}
    </>
  );
};

export function TextField({
  schema,
}: {
  schema: TextFieldSchema | DateFieldSchema;
}) {
  const field = useFieldContext<string>();

  return (
    <div className="flex flex-col mb-4">
      <FieldInfo schema={schema} />
      <Input
        type={
          schema.type === "textarea" || schema.type === "select"
            ? "text"
            : schema.type
        }
        id={schema.name}
        placeholder={schema.placeholder}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className={
          field.state.meta.errors.length ? "border-destructive mt-1" : "mt-1"
        }
      />
    </div>
  );
}

export function TextAreaField({ schema }: { schema: TextFieldSchema }) {
  const field = useFieldContext<string>();

  return (
    <div className="flex flex-col mb-4">
      <FieldInfo schema={schema} />
      <Textarea
        id={schema.name}
        placeholder={schema.placeholder}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className={
          field.state.meta.errors.length ? "border-destructive mt-1" : "mt-1"
        }
      />
    </div>
  );
}

export function NumberField({ schema }: { schema: NumberFieldSchema }) {
  const field = useFieldContext<number | undefined>();

  return (
    <div className="flex flex-col mb-4">
      <FieldInfo schema={schema} />
      <Input
        type="number"
        id={schema.name}
        placeholder={schema.placeholder}
        value={
          field.state.value === undefined || field.state.value === null
            ? ""
            : String(field.state.value)
        }
        onBlur={field.handleBlur}
        onChange={(e) => {
          const val = e.target.value;
          field.handleChange(val === "" ? undefined : Number(val));
        }}
        className={
          field.state.meta.errors.length ? "border-destructive mt-1" : "mt-1"
        }
      />
    </div>
  );
}

export function SwitchField({ schema }: { schema: SwitchFieldSchema }) {
  const field = useFieldContext<boolean>();

  return (
    <div className="flex flex-col mb-4">
      <div className="flex items-center space-x-2 mt-1">
        <Switch
          id={schema.name}
          checked={!!field.state.value}
          onCheckedChange={field.handleChange}
        />
        <Label htmlFor={schema.name} className="font-normal cursor-pointer">
          {schema.label}
        </Label>
      </div>
      {field.state.meta.errors.length > 0 && (
        <p className="text-[0.8rem] font-medium text-destructive mt-1">
          {field.state.meta.errors.join(", ")}
        </p>
      )}
    </div>
  );
}

export function SelectField({ schema }: { schema: TextFieldSchema }) {
  const field = useFieldContext<string>();

  return (
    <div className="flex flex-col mb-4">
      <FieldInfo schema={schema} />
      <div className="mt-1">
        <Select
          value={field.state.value ?? ""}
          onValueChange={field.handleChange}
        >
          <SelectTrigger
            className={
              field.state.meta.errors.length ? "border-destructive" : ""
            }
          >
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {schema.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function MultiSelectField({
  schema,
}: {
  schema: MultiSelectFieldSchema;
}) {
  const field = useFieldContext<string[]>();
  const currentValues = Array.isArray(field.state.value)
    ? field.state.value
    : [];

  return (
    <div className="flex flex-col mb-4">
      <FieldInfo schema={schema} />
      <div
        className={`flex flex-col gap-2 p-3 border rounded-md mt-1 ${
          field.state.meta.errors.length
            ? "border-destructive bg-destructive/5"
            : "border-input"
        }`}
      >
        {schema.options?.map((opt) => (
          <div key={opt.value} className="flex items-center space-x-2">
            <Checkbox
              id={`${schema.name}-${opt.value}`}
              checked={currentValues.includes(opt.value)}
              onCheckedChange={(checked) => {
                if (checked) {
                  field.handleChange([...currentValues, opt.value]);
                } else {
                  field.handleChange(
                    currentValues.filter((v) => v !== opt.value)
                  );
                }
              }}
            />
            <label
              htmlFor={`${schema.name}-${opt.value}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {opt.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
