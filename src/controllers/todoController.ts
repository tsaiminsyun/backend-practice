import { ZodError } from "zod";
import { createTodoSchema, updateTodoSchema } from "../schemas/todoSchema.js";
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

function getZodErrorMessage(error: ZodError): string {
  return error.issues[0]?.message ?? "invalid request body";
}

function parseTodoId(value: string): number | null {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
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
  const result = createTodoSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(400, getZodErrorMessage(result.error));
  }

  const todo = await createTodo(result.data.title);

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

  const result = updateTodoSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(404, getZodErrorMessage(result.error));
  }

  const todo = await updateTodo(id, result.data);

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
