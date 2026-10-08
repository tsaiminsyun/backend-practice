import type { RequestHandler } from "express";
import { AppError } from "../errors/AppError.js";
import {
  getUserById,
  loginUser,
  registerUser,
} from "../services/authService.js";

export const registerHandler: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const result = await registerUser(email, password);

  res.status(201).json({ data: result });
};

export const loginHandler: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const result = await loginUser(email, password);

  res.status(201).json({ data: result });
};

export const meHandler: RequestHandler = async (req, res) => {
  const userId = res.locals.userId as number | undefined;

  if (!userId) {
    throw new AppError(401, "unauthorized");
  }

  const user = await getUserById(userId);

  if (!user) {
    throw new AppError(401, "unauthorized");
  }

  res.json({ data: user });
};
