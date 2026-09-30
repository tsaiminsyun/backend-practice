import { prisma } from "../lib/prisma.js";
import { isRecordNotFoundError } from "../lib/prismaError.js";

export function getTodos() {
  return prisma.todo.findMany({ orderBy: { id: "asc" } });
}

export function getTodoById(id: number) {
  return prisma.todo.findUnique({ where: { id } });
}

export function createTodo(title: string) {
  return prisma.todo.create({ data: { title } });
}

export async function updateTodo(
  id: number,
  data: { title?: string; completed?: boolean },
) {
  try {
    return await prisma.todo.update({ where: { id }, data });
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return null;
    }

    throw error;
  }
}

export async function deleteTodo(id: number) {
  try {
    await await prisma.todo.delete({ where: { id } });
    return true;
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return false;
    }

    throw error;
  }
}
