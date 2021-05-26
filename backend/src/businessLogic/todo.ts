import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { TodosAccess } from '../dataLayer/TodoAccess'
import { TodoS3store } from '../dataLayer/TodoS3store'
import { TodoUpdate } from '../models/TodoUpdate'
import { createLogger } from '../utils/logger'

const logger = createLogger('todos')
const todosAccess = new TodosAccess();
const todoS3store = new TodoS3store()

export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
  const todoId = uuid.v4()
 
  
  const newItem: TodoItem = {
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: null,
    ...createTodoRequest
  }
  logger.info(`Function createTodo creates ${todoId} for user ${userId}`, { userId, todoId, todoItem: newItem })
  await todosAccess.createTodoItem(newItem)

  return newItem
}

export async function deleteTodo(userId: string, todoId: string) {
  logger.info(`Deleting Todo ${todoId} for user ${userId}`, { userId, todoId})

  const item = await todosAccess.getTodoItem(todoId)

  if (!item)
    throw new Error('Item is not exists')

  if (item.userId !== userId) {
    throw new Error('User is not authorized')
  }

  todosAccess.deleteTodoItem(todoId)
}

export async function getTodos(userId: string): Promise<TodoItem[]> {
  logger.info(`Function getTodos retrieves userId: ${userId}`, { userId })
  return await todosAccess.getTodoItems(userId)
}

export async function updateAttachmentUrl(userId: string, todoId: string, attachmentId: string) {

  const attachmentUrl = await todoS3store.getAttachmentUrl(attachmentId)

  const item = await todosAccess.getTodoItem(todoId)

  if (!item) {
    throw new Error('Item is not exists')
  }
  if (item.userId !== userId) {
    throw new Error('Authorization is required for updating item')
  }

  await todosAccess.updateAttachmentUrl(todoId, attachmentUrl)
}

export async function generateUploadUrl(attachmentId: string): Promise<string> {
  logger.info(`generate Upload URl with attachmentID ${attachmentId}`, { attachmentId })
 
  const uploadUrl = await todoS3store.getUploadUrl(attachmentId)

  return uploadUrl
}


export async function updateTodo(userId: string, todoId: string, updateTodoRequest: UpdateTodoRequest) {
  logger.info(`updateTodo with ${userId}`, { userId })

  const item = await todosAccess.getTodoItem(todoId)

  if (!item) {
    throw new Error('Item is not exists')
  }
  if (item.userId !== userId) {
    throw new Error('Authorization is required for updating item')
  }

  todosAccess.updateTodoItem(todoId, updateTodoRequest as TodoUpdate)
}