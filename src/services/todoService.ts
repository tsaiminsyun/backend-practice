import { prisma } from "../lib/prisma.js";
import { isRecordNotFoundError } from "../lib/prismaError.js";

export function getTodos(userId: number) {
  return prisma.todo.findMany({ where: { userId }, orderBy: { id: "asc" } });
}

export function getTodoById(id: number, userId: number) {
  return prisma.todo.findUnique({ where: { id, userId } });
}

export function createTodo(title: string, userId: number) {
  return prisma.todo.create({ data: { title, userId } });
}

export async function updateTodo(
  id: number,
  userId: number,
  data: { title?: string; completed?: boolean },
) {
  try {
    return await prisma.todo.update({ where: { id, userId }, data });
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return null;
    }

    throw error;
  }
}

export async function deleteTodo(id: number, userId: number) {
  try {
    await await prisma.todo.delete({ where: { id, userId } });
    return true;
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return false;
    }

    throw error;
  }
}
