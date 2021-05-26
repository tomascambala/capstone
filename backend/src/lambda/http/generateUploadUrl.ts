import 'source-map-support/register'
import { generateUploadUrl, updateAttachmentUrl } from '../../businessLogic/image'
import { getUserId } from '../utils'
import * as uuid from 'uuid'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createImage')

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing generateUpload  event', { event })
  const imageId = event.pathParameters.imageId
  const userId = getUserId(event);
  const attachmentId = uuid.v4();

  const uploadUrl = await generateUploadUrl(attachmentId);
  await updateAttachmentUrl(userId, imageId, attachmentId);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl
    })
  }
}
