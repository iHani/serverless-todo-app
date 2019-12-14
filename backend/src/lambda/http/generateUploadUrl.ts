import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

import { generateUploadUrl } from '../../businessLogic/todos'

const todoId = process.env.TODO_INDEX

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('[generateUploadUrl]: Processing event: ', event)

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const signedURL = await generateUploadUrl(todoId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      signedURL
    })
  }
}
