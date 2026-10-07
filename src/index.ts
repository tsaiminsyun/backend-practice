import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { todosRouter } from "./routes/todos.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";

const app = express();

app.use(requestLogger);

app.use(cors({ origin: env.corsOrigin }));

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ state: "ok" });
});

app.use("/todos", todosRouter);

app.use(notFoundHandler)
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Service is runing on http://localhost:${env.port}`);
});
