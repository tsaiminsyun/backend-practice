import { Router, type Router as ExpressRouter } from "express";
import {
  getTodosHandler,
  createTodosHandler,
  getTodoByIdHandler,
  updateTodoHandler,
  deleteTodoHandler,
} from "../controllers/todoController.js";
import { validateBody } from "../middlewares/valiadateBody.js";
import { validateParams } from "../middlewares/validateParams.js";
import {
  createTodoSchema,
  todoParamsSchema,
  updateTodoSchema,
} from "../schemas/todoSchema.js";

export const todosRouter: ExpressRouter = Router();

todosRouter.get("/", getTodosHandler);
todosRouter.post("/", validateBody(createTodoSchema), createTodosHandler);
todosRouter.get("/:id", validateParams(todoParamsSchema), getTodoByIdHandler);
todosRouter.patch(
  "/:id",
  validateParams(todoParamsSchema),
  validateBody(updateTodoSchema),
  updateTodoHandler,
);
todosRouter.delete("/:id", validateParams(todoParamsSchema), deleteTodoHandler);
