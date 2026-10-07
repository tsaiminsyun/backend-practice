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
