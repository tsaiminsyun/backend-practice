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

  const todo = await createTodo(title);

  res.status(201).json({
    data: todo,
  });
};

export const getTodoByIdHandler: RequestHandler<TodoParams> = async (
  req,
  res,
) => {
  const id = Number(req.params.id);

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
  const id = Number(req.params.id);

  const todo = await updateTodo(id, req.body);

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
  const id = Number(req.params.id);

  const deleted = await deleteTodo(id);

  if (!deleted) {
    throw new AppError(404, "todo not found");
  }

  res.status(204).send();
};
