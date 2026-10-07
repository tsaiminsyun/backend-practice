import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError.js";

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

    res.locals.validated = { ...res.locals.validated, body: result.data };
    next();
  };
}
