import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { createImage } from '../../businessLogic/image'
import { getUserId } from '../utils'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateImageRequest } from '../../requests/CreateImageRequest'

const logger = createLogger('createImage')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('proxy handler event', { event })
  const newImage: CreateImageRequest = JSON.parse(event.body)

  const userId = getUserId(event)
  const createdImage = await createImage(userId, newImage)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: createdImage
    })
  }
}
