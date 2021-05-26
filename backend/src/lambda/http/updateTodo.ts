import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateImageRequest } from '../../requests/UpdateImageRequest'
import { updateImage } from '../../businessLogic/image'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createImage')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing updateImage event', { event })
  const imageId = event.pathParameters.imageId
  const updatedImage: UpdateImageRequest = JSON.parse(event.body)
  const userId = getUserId(event)
  
  await updateImage(userId, imageId, updatedImage)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  }
}