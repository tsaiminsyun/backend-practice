import { ZodError } from "zod";
import type { ZodType } from "zod";
import { AppError } from "../errors/AppError.js";
import type { RequestHandler } from "express";

function getZodErrorMessage(error: ZodError): string {
  return error.issues[0]?.message ?? "invalid request body";
}

export function validateBody(schema: ZodType): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(new AppError(400, getZodErrorMessage(result.error)));
      return;
    }

    req.body = result.data;
    next();
  };
}
