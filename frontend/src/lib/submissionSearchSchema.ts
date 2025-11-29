import z from "zod";

export const submissionSearchSchema = z.object({
  page: z.number().catch(1),
  limit: z.number().catch(10),
  sortOrder: z.enum(["ASC", "DESC"]).catch("DESC"),
  q: z.string().catch(""),
});
