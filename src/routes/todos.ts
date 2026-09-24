import { Router, type Router as ExpressRouter } from "express";
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../services/todoService.js";

export const todosRouter: ExpressRouter = Router();

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

todosRouter.get("/", (req, res) => {
  res.json({
    data: getTodos(),
  });
});

todosRouter.post("/", (req, res) => {
  const { title } = req.body;

  if (!isValidTitle(title)) {
    res.status(400).json({
      message: "title must be a non-empty string",
    });
    return;
  }

  const todo = createTodo(title.trim());

  res.status(201).json({
    data: todo,
  });
});

todosRouter.get("/:id", (req, res) => {
  const id = parseTodoId(req.params.id);

  if (id === null) {
    res.status(404).json({
      message: "Id must be a postive integer",
    });
    return;
  }

  const todo = getTodoById(id);

  res.json({
    data: todo,
  });
});

todosRouter.patch("/:id", (req, res) => {
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

  const todo = updateTodo(id, {
    title: title === undefined ? undefined : title.trim(),
    completed,
  });

  if (!todo) {
    res.status(404).json({
      message: "todo not found",
    });
    return;
  }

  res.json({
    data: todo,
  });
});

todosRouter.delete("/:id", (req, res) => {
  const id = parseTodoId(req.params.id);

  if (id === null) {
    res.status(404).json({
      message: "Id must be a postive integer",
    });
    return;
  }

  const deleted = deleteTodo(id);

  if (!deleted) {
    res.status(404).json({
      message: "todo not found",
    });
    return;
  }

  res.status(204).send();
});
