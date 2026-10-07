import type { RequestHandler } from "express";
import { AppError } from "../errors/AppError.js";

export const notFoundHandler: RequestHandler = (req, res, next) => {
  next(new AppError(404, "route not found"));
};
