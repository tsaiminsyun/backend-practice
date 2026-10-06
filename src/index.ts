import express from "express";
import { env } from "./config/env.js";
import { todosRouter } from "./routes/todos.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { requestLogger } from "./middlewares/requestLogger.js";

const app = express();

app.use(requestLogger);
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ state: "ok" });
});

app.use("/todos", todosRouter);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Service is runing on http://localhost:${env.port}`);
});
