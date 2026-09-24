import express from "express";
import { todosRouter } from "./routes/todos.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ state: "ok" });
});

app.use("/todos", todosRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Service is runing on http://localhost:${port}`);
});
