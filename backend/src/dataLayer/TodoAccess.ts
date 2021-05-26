import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWSXRay from 'aws-xray-sdk'
import { ImageItem } from '../models/ImageItem'
import { ImageUpdate } from '../models/ImageUpdate'
import { createLogger } from '../utils/logger'

const logger = createLogger('imagesAccess')

const XAWS = AWSXRay.captureAWS(AWS)

export class ImagesAccess {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly imagesTable = process.env.IMAGES_TABLE,
    private readonly imagesByUserIndex = process.env.IMAGES_BY_USER_INDEX
  ) {}

  async getImageItem(imageId: string): Promise<ImageItem> {
    logger.info(`From ${this.imagesTable} getting user image item: ${imageId}`)

    const result = await this.docClient.get({
      TableName: this.imagesTable,
      Key: {
        imageId
      }
    }).promise()

    const item = result.Item

    return item as ImageItem
  }

  async createImageItem(imageItem: ImageItem) {
    logger.info(`From ${this.imagesTable} create Image Item: ${imageItem}`)

    await this.docClient.put({
      TableName: this.imagesTable,
      Item: imageItem,
    }).promise()
  }

  async deleteImageItem(imageId: string) {

    await this.docClient.delete({
      TableName: this.imagesTable,
      Key: {
        imageId
      }
    }).promise()    
  }

  async updateAttachmentUrl(imageId: string, attachmentUrl: string) {
    logger.info(`From ${this.imagesTable}update attachmentURL: ${attachmentUrl} and with ${imageId}`)

    await this.docClient.update({
      TableName: this.imagesTable,
      Key: {
        imageId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      }
    }).promise()
  }

   async updateImageItem(imageId: string, imageUpdate: ImageUpdate) {
    logger.info(`From ${this.imagesTable}update update totoId: ${imageId} and with  imageUpdate ${imageUpdate}`)

    await this.docClient.update({
      TableName: this.imagesTable,
      Key: {
        imageId
      },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        "#name": "name"
      },
      ExpressionAttributeValues: {
        ":name": imageUpdate.name,
        ":dueDate": imageUpdate.dueDate,
        ":done": imageUpdate.done
      }
    }).promise()   
  }

  async getImageItems(userId: string): Promise<ImageItem[]> {
    logger.info(`From ${this.imagesTable} getting image items for user ${userId}`)

    const result = await this.docClient.query({
      TableName: this.imagesTable,
      IndexName: this.imagesByUserIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    const items = result.Items

    return items as ImageItem[]
  }

}
