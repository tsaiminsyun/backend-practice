import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("email must be valid"),
  password: z.string().min(8, "password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.email("email must be valid"),
  password: z.string().min(1, "password is requried"),
});
