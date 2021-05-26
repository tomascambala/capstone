import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { createTodo } from '../../businessLogic/todo'
import { getUserId } from '../utils'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

const logger = createLogger('createTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('proxy handler event', { event })
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  const userId = getUserId(event)
  const createdTodo = await createTodo(userId, newTodo)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: createdTodo
    })
  }
}
