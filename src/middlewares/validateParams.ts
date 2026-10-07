import { ZodError, ZodType } from "zod";
import { AppError } from "../errors/AppError.js";
import type { RequestHandler } from "express";

function getZodErrorMessage(error: ZodError): string {
  return error.issues[0]?.message ?? "invalid route params";
}

export function validateParams(schema: ZodType): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      next(new AppError(400, getZodErrorMessage(result.error)));
      return;
    }

    res.locals.validated = {
      ...res.locals.validated,
      params: result.data,
    };

    next();
  };
}
