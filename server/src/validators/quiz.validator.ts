import { z } from "zod";

export const createSchema = z.object({
  body: z
    .object({
      title: z.string().min(2).max(50),
      topic: z.string(),
    })
    .strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});
