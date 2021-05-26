import { CreateImageRequest } from '../requests/CreateImageRequest'
import { UpdateImageRequest } from '../requests/UpdateImageRequest'
import * as uuid from 'uuid'
import { ImageItem } from '../models/ImageItem'
import { ImagesAccess } from '../dataLayer/ImageAccess'
import { ImageS3store } from '../dataLayer/ImageS3store'
import { ImageUpdate } from '../models/ImageUpdate'
import { createLogger } from '../utils/logger'

const logger = createLogger('images')
const imagesAccess = new ImagesAccess();
const imageS3store = new ImageS3store()

export async function createImage(userId: string, createImageRequest: CreateImageRequest): Promise<ImageItem> {
  const imageId = uuid.v4()
 
  
  const newItem: ImageItem = {
    userId,
    imageId,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: null,
    ...createImageRequest
  }
  logger.info(`Function createImage creates ${imageId} for user ${userId}`, { userId, imageId, imageItem: newItem })
  await imagesAccess.createImageItem(newItem)

  return newItem
}

export async function deleteImage(userId: string, imageId: string) {
  logger.info(`Deleting Image ${imageId} for user ${userId}`, { userId, imageId})

  const item = await imagesAccess.getImageItem(imageId)

  if (!item)
    throw new Error('Item is not exists')

  if (item.userId !== userId) {
    throw new Error('User is not authorized')
  }

  imagesAccess.deleteImageItem(imageId)
}

export async function getImages(userId: string): Promise<ImageItem[]> {
  logger.info(`Function getImages retrieves userId: ${userId}`, { userId })
  return await imagesAccess.getImageItems(userId)
}

export async function updateAttachmentUrl(userId: string, imageId: string, attachmentId: string) {

  const attachmentUrl = await imageS3store.getAttachmentUrl(attachmentId)

  const item = await imagesAccess.getImageItem(imageId)

  if (!item) {
    throw new Error('Item is not exists')
  }
  if (item.userId !== userId) {
    throw new Error('Authorization is required for updating item')
  }

  await imagesAccess.updateAttachmentUrl(imageId, attachmentUrl)
}

export async function generateUploadUrl(attachmentId: string): Promise<string> {
  logger.info(`generate Upload URl with attachmentID ${attachmentId}`, { attachmentId })
 
  const uploadUrl = await imageS3store.getUploadUrl(attachmentId)

  return uploadUrl
}


export async function updateImage(userId: string, imageId: string, updateImageRequest: UpdateImageRequest) {
  logger.info(`updateImage with ${userId}`, { userId })

  const item = await imagesAccess.getImageItem(imageId)

  if (!item) {
    throw new Error('Item is not exists')
  }
  if (item.userId !== userId) {
    throw new Error('Authorization is required for updating item')
  }

  imagesAccess.updateImageItem(imageId, updateImageRequest as ImageUpdate)
}