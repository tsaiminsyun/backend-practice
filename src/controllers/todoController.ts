import type { RequestHandler } from "express";
import type {
  CreateTodoBody,
  TodoParams,
  UpdateTodoBody,
} from "../schemas/todoSchema.js";
import type { ValidatedRequest } from "../types/exporess.js";
import { AppError } from "../errors/AppError.js";
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../services/todoService.js";

export const getTodosHandler: RequestHandler<TodoParams> = async (req, res) => {
  const userId = res.locals.userId as number;
  const todos = await getTodos(userId);

  res.json({
    data: todos,
  });
};

export const createTodosHandler: RequestHandler = async (req, res) => {
  const { body } = res.locals.validated as ValidatedRequest<CreateTodoBody>;

  if (!body) {
    throw new AppError(400, "invalid request body");
  }

  const userId = res.locals.userId as number;
  const todo = await createTodo(body.title, userId);

  res.status(201).json({
    data: todo,
  });
};

export const getTodoByIdHandler: RequestHandler<TodoParams> = async (
  req,
  res,
) => {
  const { params } = res.locals.validated as ValidatedRequest<
    unknown,
    TodoParams
  >;

  if (!params) {
    throw new AppError(400, "invalid route params");
  }

  const userId = res.locals.userId as number;
  const todo = await getTodoById(params.id, userId);

  if (!todo) {
    throw new AppError(404, "todo not found");
  }

  res.json({
    data: todo,
  });
};

export const updateTodoHandler: RequestHandler<TodoParams> = async (
  req,
  res,
) => {
  const { body, params } = res.locals.validated as ValidatedRequest<
    UpdateTodoBody,
    TodoParams
  >;

  if (!params) {
    throw new AppError(400, "invalid route params");
  }

  if (!body) {
    throw new AppError(400, "invalid request body");
  }

  const userId = res.locals.userId as number;
  const todo = await updateTodo(params.id, userId, body);

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
  const { params } = res.locals.validated as ValidatedRequest<
    unknown,
    TodoParams
  >;

  if (!params) {
    throw new AppError(400, "invalid route params");
  }

  const userId = res.locals.userId as number;
  const deleted = await deleteTodo(params.id, userId);

  if (!deleted) {
    throw new AppError(404, "todo not found");
  }

  res.status(204).send();
};
