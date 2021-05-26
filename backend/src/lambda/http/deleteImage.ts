import 'source-map-support/register'
import { getUserId } from '../utils'
import { deleteImage } from '../../businessLogic/image'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createImage')

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing delete event', { event })
  const imageId = event.pathParameters.imageId
  const userId = getUserId(event)
  
  await deleteImage(userId, imageId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}