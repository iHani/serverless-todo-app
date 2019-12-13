import * as uuid from 'uuid'

import { TodoAccess } from '../dataLayer/todossAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { parseUserId } from '../auth/utils'
import { TodoItem } from '../models/TodoItem'

const todoAccess = new TodoAccess();

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {

  const itemId = uuid.v4()
  const userId = parseUserId(jwtToken)

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

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  return await todoAccess.getAllTodos(userId)
}

export async function deleteTodo(
  todoId: string,
  jwtToken: string
): Promise<string> {

  const userId = parseUserId(jwtToken)

  return await todoAccess.deleteTodo(todoId, userId)
}
