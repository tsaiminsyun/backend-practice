import { Router, type Router as ExpressRouter } from "express";
import { rateLimit } from "express-rate-limit";
import {
  loginHandler,
  meHandler,
  registerHandler,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateBody } from "../middlewares/valiadateBody.js";
import { loginSchema, registerSchema } from "../schemas/authSchema.js";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    message: "too many login attempts, try again later",
  },
});

export const authRouter: ExpressRouter = Router();

authRouter.post("/register", validateBody(registerSchema), registerHandler);
authRouter.post(
  "/login",
  loginLimiter,
  validateBody(loginSchema),
  loginHandler,
);
authRouter.get("/me", authMiddleware, meHandler);
