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

function parseTodoId(value: string): number | null {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function isValidTitle(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidCompleted(value: unknown): value is boolean {
  return typeof value === "boolean";
}

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

  if (!isValidTitle(title)) {
    res.status(400).json({
      message: "title must be a non-empty string",
    });
    return;
  }

  const todo: Todo = {
    id: nextId,
    title: title.trim(),
    completed: false,
  };

  todos.push(todo);
  nextId += 1;

  res.status(201).json({
    data: todo,
  });
});

app.get("/todos/:id", (req, res) => {
  const id = parseTodoId(req.params.id);
  const todo = todos.find((todo) => todo.id === id);

  if (id === null) {
    res.status(404).json({
      message: "Id must be a postive integer",
    });
    return;
  }

  res.json({
    data: todo,
  });
});

app.patch("/todos/:id", (req, res) => {
  const id = parseTodoId(req.params.id);

  if (id === null) {
    res.status(404).json({
      message: "Id must be a postive integer",
    });
    return;
  }

  const { title, completed } = req.body;

  if (title === undefined && completed === undefined) {
    res.status(404).json({
      message: "title or completed is required",
    });
    return;
  }

  if (title !== undefined && isValidTitle(title)) {
    res.status(404).json({
      message: "title must be a non-empty string",
    });
    return;
  }

  if (completed !== undefined && !isValidCompleted(completed)) {
    res.status(404).json({
      message: "completed must be a boolean",
    });
    return;
  }

  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    res.status(404).json({
      message: "todo not found",
    });
    return;
  }

  if (title !== undefined) {
    todo.title = title.trim();
  }

  if (completed !== undefined) {
    todo.completed = completed;
  }

  res.json({
    data: todo,
  });
});

app.delete("/todos/:id", (req, res) => {
  const id = parseTodoId(req.params.id);

  if (id === null) {
    res.status(404).json({
      message: "Id must be a postive integer",
    });
    return;
  }

  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    res.status(404).json({
      message: "todo not found",
    });
    return;
  }

  todos.splice(todoIndex, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Service is runing on http://localhost:${port}`);
});
