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
      <div className="p-12 text-center text-muted-foreground animate-pulse">
        Loading form...
      </div>
    );
  if (error || !schema)
    return (
      <div className="p-12 text-center text-destructive">
        Error loading form definition.
      </div>
    );

  return (
    <Card className="w-full max-w-2xl mx-auto my-10 border shadow-sm">
      <CardHeader>
        <CardTitle>{schema.title}</CardTitle>
        <CardDescription>{schema.description}</CardDescription>
      </CardHeader>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <CardContent className="space-y-2">
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
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6 bg-gray-50/50">
          <Button
            type="button"
            variant="ghost"
            onClick={() => form.reset()}
            disabled={mutation.isPending}
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="min-w-[120px]"
          >
            {mutation.isPending ? "Submitting..." : "Submit"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
