import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().trim().min(1, "title must be a non-empty string"),
});

export const updateTodoSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "title must be a non-empty string")
      .exactOptional(),
    completed: z.boolean("completed must be a boolean").exactOptional(),
  })
  .refine((data) => data.title !== undefined || data.completed !== undefined, {
    message: "title or completed is required",
  });

export const todoParamsSchema = z.object({
  id: z.coerce
    .number()
    .int("id must be a positive integer")
    .positive("id must be a positive integer"),
});

export type CreateTodoBody = z.infer<typeof createTodoSchema>;
export type UpdateTodoBody = z.infer<typeof updateTodoSchema>;
export type TodoParams = z.infer<typeof todoParamsSchema>;
