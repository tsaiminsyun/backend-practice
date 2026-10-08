import jwt from "jsonwebtoken";
import type { RequestHandler } from "express";
import { AppError } from "../errors/AppError.js";
import { env } from "../config/env.js";

type JwtPayload = {
  userId: number;
};

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    next(new AppError(401, "unauthorized"));
    return;
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    next(new AppError(401, "unauthorized"));
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;

    res.locals.userId = payload.userId;

    next();
  } catch (error) {
    next(new AppError(401, "unauthorized"));
  }
};
