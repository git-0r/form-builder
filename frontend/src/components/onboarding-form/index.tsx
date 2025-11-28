"use client";

import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useFormSchema } from "../../hooks/useFormSchema";
import { createZodSchema } from "../../lib/zod-generator";
import { useAppForm } from "../../hooks/useAppForm";
import type { AxiosError } from "axios";

export default function OnboardingForm() {
  const { data: schema, isLoading, error } = useFormSchema();
  const queryClient = useQueryClient();

  const zodSchema = useMemo(() => {
    return schema?.fields ? createZodSchema(schema.fields) : null;
  }, [schema]);

  const mutation = useMutation({
    mutationFn: (data: unknown) => api.post("/submissions", data),
    onSuccess: () => {
      alert("Application Submitted Successfully!");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{
        errors: Record<string, string>;
      }>;
      const backendErrors = axiosError.response?.data?.errors;

      const msg = backendErrors
        ? Object.values(backendErrors).join("\n")
        : "Submission failed. Please check your inputs.";
      alert(msg);
    },
  });

  const form = useAppForm({
    defaultValues: {},
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
    },
  });

  if (isLoading)
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="animate-pulse font-mono text-xs uppercase tracking-widest text-zinc-400">
          Loading configuration...
        </div>
      </div>
    );
  if (error || !schema)
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="font-mono text-xs uppercase tracking-widest text-red-500">
          Error loading form definition
        </div>
      </div>
    );

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <Card className="mx-auto max-w-3xl border-zinc-200 bg-white rounded-sm py-0">
        <CardHeader className="border-b border-zinc-100 pb-8 pt-8">
          <div className="space-y-2 text-center sm:text-left">
            <CardTitle className="text-3xl font-bold text-center tracking-tight text-zinc-900 sm:text-4xl">
              {schema.title}
            </CardTitle>
            <CardDescription className="text-base text-center font-normal text-zinc-500">
              {schema.description}
            </CardDescription>
          </div>
        </CardHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <CardContent className="px-6 py-4 sm:px-10">
            <div className="grid gap-4">
              {schema.fields.map((fieldSchema) => (
                <form.AppField
                  key={fieldSchema.name}
                  name={fieldSchema.name}
                  validators={{
                    onChange: ({ value }) => {
                      if (!zodSchema) return undefined;
                      const fieldValidator = zodSchema.shape[fieldSchema.name];
                      const result = fieldValidator.safeParse(value);
                      return result.success
                        ? undefined
                        : result.error.issues[0].message;
                    },
                  }}
                >
                  {(field) => {
                    switch (fieldSchema.type) {
                      case "textarea":
                        return <field.TextAreaField schema={fieldSchema} />;
                      case "number":
                        return <field.NumberField schema={fieldSchema} />;
                      case "select":
                        return <field.SelectField schema={fieldSchema} />;
                      case "switch":
                        return <field.SwitchField schema={fieldSchema} />;
                      case "multi-select":
                        return <field.MultiSelectField schema={fieldSchema} />;
                      default:
                        return <field.TextField schema={fieldSchema} />;
                    }
                  }}
                </form.AppField>
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col items-center gap-4 border-t border-zinc-100 bg-zinc-50/50 px-6 py-8 sm:flex-row sm:justify-between sm:px-10">
            <Button
              type="button"
              variant="ghost"
              onClick={() => form.reset()}
              disabled={mutation.isPending}
              className="w-full rounded-none text-zinc-500 hover:bg-transparent hover:text-zinc-900 sm:w-auto cursor-pointer"
            >
              RESET FORM
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-sm bg-violet-900 px-8 py-6 text-sm font-medium uppercase tracking-wider text-white shadow-none transition-all hover:bg-violet-800 disabled:opacity-50 sm:w-auto cursor-pointer"
            >
              {mutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                  PROCESSING...
                </span>
              ) : (
                "SUBMIT APPLICATION"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
