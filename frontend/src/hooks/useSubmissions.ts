import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface Submission {
  id: string;
  data: Record<string, unknown>;
  createdAt: string;
}

interface SubmissionsResponse {
  success: boolean;
  data: Submission[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface UseSubmissionsParams {
  page: number;
  limit: number;
  sortOrder: "ASC" | "DESC";
  q?: string;
}

export const useSubmissions = (params: UseSubmissionsParams) => {
  return useQuery({
    queryKey: ["submissions", params],
    queryFn: async () => {
      const { data } = await api.get<SubmissionsResponse>("/submissions", {
        params,
      });
      return data;
    },
    staleTime: 5000,
    placeholderData: (previousData) => previousData,
  });
};

export const useSubmission = (id?: string) => {
  return useQuery({
    queryKey: ["submission", id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await api.get<{ success: boolean; data: Submission }>(
        `/submissions/${id}`
      );
      return data.data;
    },
    enabled: !!id,
  });
};
