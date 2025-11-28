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

const getSharpInputClasses = (hasError: boolean) =>
  `rounded-none border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-none transition-colors 
   placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 
   disabled:cursor-not-allowed disabled:opacity-50
   ${
     hasError
       ? "border-red-500 focus-visible:ring-red-500"
       : "hover:border-zinc-300"
   }`;

const FieldInfo = ({ schema }: { schema: FormFieldSchema }) => {
  const field = useFieldContext();
  const hasError = field.state.meta.errors.length > 0;

  return (
    <div className="flex items-baseline justify-between mb-2">
      <Label
        htmlFor={schema.name}
        className={`text-xs font-medium uppercase tracking-wider text-zinc-500 ${
          hasError ? "text-red-500" : ""
        }`}
      >
        {schema.label}
        {schema.required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {hasError && (
        <span className="text-[10px] font-medium text-red-500 uppercase tracking-wide">
          {field.state.meta.errors.join(", ")}
        </span>
      )}
    </div>
  );
};

export function TextField({
  schema,
}: {
  schema: TextFieldSchema | DateFieldSchema;
}) {
  const field = useFieldContext<string>();
  const hasError = field.state.meta.errors.length > 0;

  return (
    <div className="group mb-6">
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
        className={getSharpInputClasses(hasError)}
      />
    </div>
  );
}

export function TextAreaField({ schema }: { schema: TextFieldSchema }) {
  const field = useFieldContext<string>();
  const hasError = field.state.meta.errors.length > 0;

  return (
    <div className="group mb-6">
      <FieldInfo schema={schema} />
      <Textarea
        id={schema.name}
        placeholder={schema.placeholder}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className={`${getSharpInputClasses(
          hasError
        )} min-h-[120px] resize-none`}
      />
    </div>
  );
}

export function NumberField({ schema }: { schema: NumberFieldSchema }) {
  const field = useFieldContext<number | undefined>();
  const hasError = field.state.meta.errors.length > 0;

  return (
    <div className="group mb-6">
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
        className={getSharpInputClasses(hasError)}
      />
    </div>
  );
}

export function SwitchField({ schema }: { schema: SwitchFieldSchema }) {
  const field = useFieldContext<boolean>();
  const hasError = field.state.meta.errors.length > 0;

  return (
    <div className="group mb-6 flex items-center justify-between border-b border-zinc-100 pb-4">
      <div className="space-y-1">
        <Label
          htmlFor={schema.name}
          className={`text-sm font-medium text-zinc-900 ${
            hasError ? "text-red-500" : ""
          }`}
        >
          {schema.label}
        </Label>
        {hasError && (
          <p className="text-[10px] font-medium text-red-500 uppercase tracking-wide">
            {field.state.meta.errors.join(", ")}
          </p>
        )}
      </div>
      <Switch
        id={schema.name}
        checked={!!field.state.value}
        onCheckedChange={field.handleChange}
        className="data-[state=checked]:bg-zinc-900"
      />
    </div>
  );
}

export function SelectField({ schema }: { schema: TextFieldSchema }) {
  const field = useFieldContext<string>();
  const hasError = field.state.meta.errors.length > 0;

  return (
    <div className="group mb-6">
      <FieldInfo schema={schema} />
      <Select
        value={field.state.value ?? ""}
        onValueChange={field.handleChange}
      >
        <SelectTrigger className={getSharpInputClasses(hasError)}>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent className="rounded-none border-zinc-200 shadow-none">
          {schema.options?.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="rounded-none cursor-pointer focus:bg-zinc-100 focus:text-zinc-900"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
  const hasError = field.state.meta.errors.length > 0;

  return (
    <div className="group mb-6">
      <FieldInfo schema={schema} />
      <div
        className={`grid grid-cols-1 gap-2 p-4 border transition-colors sm:grid-cols-2 ${
          hasError
            ? "border-red-200 bg-red-50/10"
            : "border-zinc-100 bg-zinc-50/30"
        }`}
      >
        {schema.options?.map((opt) => {
          const isSelected = currentValues.includes(opt.value);
          return (
            <div
              key={opt.value}
              className={`flex flex-row items-start space-x-3 border p-3 transition-all hover:bg-white ${
                isSelected
                  ? "border-zinc-800 bg-white shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]"
                  : "border-transparent hover:border-zinc-200"
              }`}
            >
              <Checkbox
                id={`${schema.name}-${opt.value}`}
                checked={isSelected}
                onCheckedChange={(checked) => {
                  if (checked) {
                    field.handleChange([...currentValues, opt.value]);
                  } else {
                    field.handleChange(
                      currentValues.filter((v) => v !== opt.value)
                    );
                  }
                }}
                className="mt-0.5 rounded-none border-zinc-400 data-[state=checked]:bg-zinc-900 data-[state=checked]:border-zinc-900 data-[state=checked]:text-zinc-50"
              />
              <Label
                htmlFor={`${schema.name}-${opt.value}`}
                className="w-full cursor-pointer select-none text-sm font-medium text-zinc-700 leading-normal"
              >
                {opt.label}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
