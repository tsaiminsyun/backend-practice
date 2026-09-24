import type { RequestHandler } from "express";
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../services/todoService.js";

type TodoParams = {
  id: string;
};

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

export const getTodosHandler: RequestHandler<TodoParams> = (req, res) => {
  res.json({
    data: getTodos(),
  });
};

export const createTodosHandler: RequestHandler<TodoParams> = (req, res) => {
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
};

export const getTodoByIdHandler: RequestHandler<TodoParams> = (req, res) => {
  const id = parseTodoId(req.params.id);

  if (id === null) {
    res.status(400).json({
      message: "Id must be a postive integer",
    });
    return;
  }

  const todo = getTodoById(id);

  if (!todo) {
    res.status(404).json({
      message: "todo not find",
    });
    return;
  }

  res.json({
    data: todo,
  });
};

export const updateTodoHandler: RequestHandler<TodoParams> = (req, res) => {
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
};

export const deleteTodoHandler: RequestHandler<TodoParams> = (req, res) => {
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
};
