import { Router, type Router as ExpressRouter } from "express";
import {
  loginHandler,
  meHandler,
  registerHandler,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateBody } from "../middlewares/valiadateBody.js";
import { loginSchema, registerSchema } from "../schemas/authSchema.js";

export const authRouter: ExpressRouter = Router();

authRouter.post("/register", validateBody(registerSchema), registerHandler);
authRouter.post("/login", validateBody(loginSchema), loginHandler);
authRouter.get("/me", authMiddleware, meHandler);
