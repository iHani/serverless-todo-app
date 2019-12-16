import * as uuid from 'uuid'

import { TodoAccess } from '../dataLayer/todossAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { TodoItem } from '../models/TodoItem'

const todoAccess = new TodoAccess()

// createTodo
export async function createTodo(newTodo: CreateTodoRequest, userId: string) {
  const item = {
    // todoId: itemId,
    // userId: userId,
    // name: createTodoRequest.name,
    // dueDate: createTodoRequest.dueDate,
    // done: false,
    // createdAt: new Date().toISOString()
    userId,
    todoId: uuid.v4(),
    done: false,
    createdAt: new Date().toISOString(),
    ...newTodo
  }

  console.log('New todo:', userId, item)
  return await todoAccess.CreateTodo(item)
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
  updatedTodo
): Promise<string> {
  return await todoAccess.updateTodo(userId, todoId, updatedTodo)
}

// generateUrl
export async function generateUploadUrl(todoId: string): Promise<string> {
  return await todoAccess.generateUploadUrl(todoId)
}
