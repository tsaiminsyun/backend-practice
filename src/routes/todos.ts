import { Router, type Router as ExpressRouter } from "express";
import {
  getTodosHandler,
  createTodosHandler,
  getTodoByIdHandler,
  updateTodoHandler,
  deleteTodoHandler,
} from "../controllers/todoController.js";

export const todosRouter: ExpressRouter = Router();

todosRouter.get("/", getTodosHandler);
todosRouter.post("/", createTodosHandler);
todosRouter.get("/:id", getTodoByIdHandler);
todosRouter.patch("/:id", updateTodoHandler);
todosRouter.delete("/:id", deleteTodoHandler);
