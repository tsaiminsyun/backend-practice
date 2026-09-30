import { prisma } from "../lib/prisma.js";

export function getTodos() {
  return prisma.todo.findMany({ orderBy: { id: "asc" } });
}

export function getTodoById(id: number) {
  return prisma.todo.findMany({ where: { id } });
}

export function createTodo(title: string) {
  return prisma.todo.create({ data: { title } });
}

export function updateTodo(
  id: number,
  data: { title?: string; completed?: boolean },
) {
  return prisma.todo.update({ where: { id }, data });
}

export async function deleteTodo(id: number) {
  const todo = await getTodoById(id);
  if (!todo) {
    return false;
  }

  await prisma.todo.delete({ where: { id } });

  return true;
}
