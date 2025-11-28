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

const INPUT_BASE =
  "h-14 bg-white border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all rounded-sm text-base md:text-lg hover:border-slate-300";
const INPUT_ERROR =
  "border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-400";

const FieldWrapper = ({
  schema,
  children,
}: {
  schema: FormFieldSchema;
  children: React.ReactNode;
}) => {
  const field = useFieldContext();
  const hasError = field.state.meta.errors.length > 0;

  return (
    <div className="group space-y-2 mb-6 h-">
      <div className="flex justify-between items-center">
        <Label
          htmlFor={schema.name}
          className={`text-sm md:text-base font-medium tracking-tight ${
            hasError ? "text-red-600" : "text-slate-700"
          }`}
        >
          {schema.label}
          {schema.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {hasError && (
          <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full animate-in fade-in">
            {field.state.meta.errors[0]}
          </span>
        )}
      </div>
      {children}
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
    <FieldWrapper schema={schema}>
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
        className={`${INPUT_BASE} ${hasError ? INPUT_ERROR : ""}`}
      />
    </FieldWrapper>
  );
}

export function TextAreaField({ schema }: { schema: TextFieldSchema }) {
  const field = useFieldContext<string>();
  const hasError = field.state.meta.errors.length > 0;

  return (
    <FieldWrapper schema={schema}>
      <Textarea
        id={schema.name}
        placeholder={schema.placeholder}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className={`min-h-[120px] resize-y bg-white border-slate-200 focus:ring-2 focus:ring-violet-500 rounded-sm text-base md:text-lg ${
          hasError ? INPUT_ERROR : ""
        }`}
      />
    </FieldWrapper>
  );
}

export function NumberField({ schema }: { schema: NumberFieldSchema }) {
  const field = useFieldContext<number | undefined>();
  const hasError = field.state.meta.errors.length > 0;

  return (
    <FieldWrapper schema={schema}>
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
        className={`${INPUT_BASE} ${hasError ? INPUT_ERROR : ""}`}
      />
    </FieldWrapper>
  );
}

export function SwitchField({ schema }: { schema: SwitchFieldSchema }) {
  const field = useFieldContext<boolean>();
  const hasError = field.state.meta.errors.length > 0;

  return (
    <div
      className={`flex items-center justify-between p-4 border rounded-sm bg-white mb-6 transition-all ${
        hasError
          ? "border-red-200 bg-red-50/30"
          : "border-slate-200 hover:border-violet-200"
      }`}
    >
      <div className="space-y-1">
        <Label
          htmlFor={schema.name}
          className="text-base font-medium text-slate-800 cursor-pointer"
        >
          {schema.label}
        </Label>
        {hasError && (
          <p className="text-xs text-red-500 font-medium">
            {field.state.meta.errors[0]}
          </p>
        )}
      </div>
      <Switch
        id={schema.name}
        checked={!!field.state.value}
        onCheckedChange={field.handleChange}
        className="data-[state=checked]:bg-violet-600"
      />
    </div>
  );
}

export function SelectField({ schema }: { schema: TextFieldSchema }) {
  const field = useFieldContext<string>();
  const hasError = field.state.meta.errors.length > 0;

  return (
    <FieldWrapper schema={schema}>
      <Select
        value={field.state.value ?? ""}
        onValueChange={field.handleChange}
      >
        <SelectTrigger
          className={`${INPUT_BASE} ${hasError ? INPUT_ERROR : ""} py-6`}
        >
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent className="rounded-sm border-slate-100">
          {schema.options?.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="focus:bg-violet-50 focus:text-violet-700 py-3 cursor-pointer text-lg"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
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
    <FieldWrapper schema={schema}>
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 p-1`}>
        {schema.options?.map((opt) => {
          const isSelected = currentValues.includes(opt.value);
          return (
            <div
              key={opt.value}
              className={`
                relative flex items-center space-x-3 rounded-sm border p-4 transition-all
                ${
                  isSelected
                    ? "border-violet-600 bg-violet-50 ring-1 ring-violet-600"
                    : "border-slate-200 bg-white hover:border-violet-300"
                }
              `}
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
                className={`
                  mt-0.5 rounded
                  ${
                    isSelected
                      ? "data-[state=checked]:bg-violet-600 border-violet-600"
                      : "border-slate-300"
                  }
                `}
              />
              <div className="flex-1">
                <Label
                  htmlFor={`${schema.name}-${opt.value}`}
                  className={`text-sm md:text-lg font-medium leading-relaxed cursor-pointer ${
                    isSelected ? "text-violet-900" : "text-slate-700"
                  }`}
                >
                  {opt.label}
                </Label>
              </div>
            </div>
          );
        })}
      </div>
    </FieldWrapper>
  );
}
