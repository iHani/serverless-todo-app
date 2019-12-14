import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { TodoItem } from '../models/TodoItem';

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE) { }

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    console.log('Getting all todos for user:', userId);

    const result = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':userId': userId
      },
    }).promise();

    const todos = result.Items;
    console.log("getAllTodos result:", todos);
    return todos as TodoItem[];
  }

  async createTodo(todo) {
    console.log("Creating Todo:", todo);

    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise();

    console.log("Todo created:", todo);
    return todo;
  }

  async deleteTodo(todoId: string, userId: string): Promise<string> {
    console.log("Deleting todo:", todoId);

    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        todoId,
        userId
      },
    }).promise();

    console.log("Todo deleted. todoId:", todoId);
    return "";
  }

  async updateTodo(userId: string, todoId: string, updatedTodo): Promise<string> {
    console.log("updating todo:", todoId, updatedTodo);

    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        todoId,
        userId,
      },
      UpdateExpression: 'set #name = :name, dueDate = :duedate, done = :done',
      ExpressionAttributeValues: {
        ':name': updatedTodo.name,
        ':duedate': updatedTodo.dueDate,
        ':done': updatedTodo.done
      },
      ExpressionAttributeNames: {
        "#name": "name"
      }
    }).promise()

    console.log("Todo updated:", updatedTodo);

    return updatedTodo;
  }
}


function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new AWS.DynamoDB.DocumentClient()
}
