import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { todosRouter } from "./routes/todos.js";
import { authRouter } from './routes/auth.js';


export const app = express();

app.use(requestLogger);

app.use(cors({ origin: env.corsOrigin }));

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/todos", todosRouter);
app.use("/auth", authRouter);

app.use(notFoundHandler);
app.use(errorHandler);
