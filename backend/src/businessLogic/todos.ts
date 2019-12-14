import * as uuid from 'uuid'

import { TodoAccess } from '../dataLayer/todossAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { TodoItem } from '../models/TodoItem'

const todoAccess = new TodoAccess();

// createTodo
export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {

  const itemId = uuid.v4()
  const todo = {
    todoId: itemId,
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    createdAt: new Date().toISOString()
  };

  console.log("New todo:", userId, todo);
  return await todoAccess.createTodo(todo)
}

// getAllTodos
export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  return await todoAccess.getAllTodos(userId)
}

// deleteTodo
export async function deleteTodo(
  todoId: string,
  userId: string
): Promise<string> {

  return await todoAccess.deleteTodo(todoId, userId)
}

// updateTodo
export async function updateTodo(
  userId: string,
  todoId: string,
  updatedTodo,
): Promise<string> {

  return await todoAccess.updateTodo(userId, todoId, updatedTodo)
}
