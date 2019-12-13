import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem';
// import { DeleteTodoItem } from '../models/DeleteTodoItem'

const todosTable = process.env.TODOS_TABLE
// const todoIdIndex = process.env.TODO_INDEX

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly TODOS_TABLE = todosTable) {
  }

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    console.log('Getting all todos for user:', userId);


    const result = await this.docClient.query({
      TableName: this.TODOS_TABLE,
      // IndexName: this.TODO_INDEX,
      // KeyConditionExpression: 'userId = :userId',
      // ExpressionAttributeValues: {
      //   ':userId': userId
      // },

      //
      KeyConditionExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':userId': userId
      },
      //
    }).promise()

    console.log("getAllTodos result:", result);

    const todos = result.Items
    return todos as TodoItem[]
  }

  async createTodo(todo) {
    await this.docClient.put({
      TableName: this.TODOS_TABLE,
      Item: todo
    }).promise()

    return todo;
  }

  async deleteTodo(todoId: string, userId: string): Promise<string> {
    await this.docClient.delete({
      TableName: this.TODOS_TABLE,
      Key: {
        todoId: todoId,
        userId: userId
      },
      ConditionExpression: "todoId = :todoId",
      ExpressionAttributeValues: {
        ':todoId': todoId
      }
    }).promise()

    console.log("Todo deleted. todoId:", todoId);

    return ""
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
