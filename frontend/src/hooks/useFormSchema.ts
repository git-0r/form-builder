import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { FormSchema } from "../types/schema";

export const useFormSchema = () => {
  return useQuery({
    queryKey: ["form-schema"],
    queryFn: async () => {
      const { data } = await api.get<FormSchema>("/form-schema");
      return data;
    },
    staleTime: Infinity,
  });
};
