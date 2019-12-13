import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const bucketName = process.env.IMAGES_S3_BUCKET
const todoId = process.env.TODO_INDEX
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("Processing event:", event);

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const signedURL = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      signedURL
    })
  }
}
