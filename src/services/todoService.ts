import type { Todo } from "../types/todo.js";

const todos: Todo[] = [];
let nextId = 1;

export function getTodos(): Todo[] {
  return todos;
}

export function getTodoById(id: number): Todo | undefined {
  return todos.find((todo) => todo.id == id);
}

export function createTodo(title: string): Todo {
  const todo: Todo = {
    id: nextId,
    title,
    completed: false,
  };

  todos.push(todo);
  nextId += 1;

  return todo;
}

export function updateTodo(
  id: number,
  data: { title?: string; completed?: boolean },
): Todo | undefined {
  const todo = getTodoById(id);

  if (!todo) return undefined;

  if (data.title !== undefined) {
    todo.title = data.title;
  }

  if (data.completed !== undefined) {
    todo.completed = data.completed;
  }

  return todo;
}

export function deleteTodo(id: number): boolean {
  const index = todos.findIndex((todo) => todo.id === id);

  if (index === -1) {
    return false;
  }

  todos.splice(index, 1);
  return true;
}
