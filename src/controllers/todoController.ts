import type { RequestHandler } from "express";
import { AppError } from "../errors/AppError.js";
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

export const getTodosHandler: RequestHandler<TodoParams> = async (req, res) => {
  const todos = await getTodos();

  res.json({
    data: todos,
  });
};

export const createTodosHandler: RequestHandler<TodoParams> = async (
  req,
  res,
) => {
  const { title } = req.body;

  if (!isValidTitle(title)) {
    throw new AppError(400, "title must be a non-empty string");
  }

  const todo = await createTodo(title.trim());

  res.status(201).json({
    data: todo,
  });
};

export const getTodoByIdHandler: RequestHandler<TodoParams> = async (
  req,
  res,
) => {
  const id = parseTodoId(req.params.id);

  if (id === null) {
    throw new AppError(400, "id must be a postive integer");
  }

  const todo = await getTodoById(id);

  if (!todo) {
    throw new AppError(404, "todo not find");
  }

  res.json({
    data: todo,
  });
};

export const updateTodoHandler: RequestHandler<TodoParams> = async (
  req,
  res,
) => {
  const id = parseTodoId(req.params.id);

  if (id === null) {
    throw new AppError(404, "id must be a postive integer");
  }

  const { title, completed } = req.body;

  if (title === undefined && completed === undefined) {
    throw new AppError(404, "title or completed is required");
  }

  if (title !== undefined && isValidTitle(title)) {
    throw new AppError(404, "title must be a non-empty string");
  }

  if (completed !== undefined && !isValidCompleted(completed)) {
    throw new AppError(404, "completed must be a boolean");
  }

  const todo = await updateTodo(id, {
    title: title === undefined ? undefined : title.trim(),
    completed,
  });

  if (!todo) {
    throw new AppError(404, "todo not found");
  }

  res.json({
    data: todo,
  });
};

export const deleteTodoHandler: RequestHandler<TodoParams> = async (
  req,
  res,
) => {
  const id = parseTodoId(req.params.id);

  if (id === null) {
    throw new AppError(404, "id must be a postive integer");
  }

  const deleted = await deleteTodo(id);

  if (!deleted) {
    throw new AppError(404, "todo not found");
  }

  res.status(204).send();
};
