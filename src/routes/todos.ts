import { Router, type Router as ExpressRouter } from "express";
import {
  getTodosHandler,
  createTodosHandler,
  getTodoByIdHandler,
  updateTodoHandler,
  deleteTodoHandler,
} from "../controllers/todoController.js";
import { validateBody } from "../middlewares/valiadateBody.js";
import { createTodoSchema, updateTodoSchema } from "../schemas/todoSchema.js";

export const todosRouter: ExpressRouter = Router();

todosRouter.get("/", getTodosHandler);
todosRouter.post("/", validateBody(createTodoSchema), createTodosHandler);
todosRouter.get("/:id", getTodoByIdHandler);
todosRouter.patch("/:id", validateBody(updateTodoSchema), updateTodoHandler);
todosRouter.delete("/:id", deleteTodoHandler);
