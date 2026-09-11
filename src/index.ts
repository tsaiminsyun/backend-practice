import express from "express";
import { json } from "stream/consumers";

const app = express();
const port = 3000;

app.use(express.json());

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const todos: Todo[] = [];
let nextId = 1;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/health", (req, res) => {
  res.json({ state: "ok" });
});

app.get("/todos", (req, res) => {
  res.json({
    todos,
  });
});

app.post("/todos", (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.status(400).json({
      message: "title is required",
    });
    return;
  }

  const todo: Todo = {
    id: nextId,
    title,
    completed: false,
  };

  todos.push(todo);
  nextId += 1;

  res.status(201).json({
    data: todo,
  });
});

app.listen(port, () => {
  console.log(`Service is runing on http://localhost:${port}`);
});
