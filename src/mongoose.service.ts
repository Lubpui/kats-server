import {
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose'
import { Request } from 'express'
import { Connection } from 'mongoose'
import { MAIN_DATABASE_NAME } from './utils/constanrs'
import { ConfigService } from '@nestjs/config'

export const cachingConnections: { [key: string]: Connection } = {}

@Injectable({ scope: Scope.REQUEST })
export class MongooseService implements MongooseOptionsFactory {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ในแต่ละ Module ที่ Imports MongooseModule.forFeature มาใช้งาน ถ้ามีการเรียกใช้งาน CUSTOM_CONNECTION_NAME จะเรียกไฟล์ moongose.service.ts
  createMongooseOptions(): MongooseModuleOptions {
    const { headers, originalUrl } = this.request
    // TODO: rewite this this.request.user.dbname

    const authPattern = new RegExp('/auth/*')
    const userOwnerPattern = new RegExp('/users/owner')
    const webhookPattern = new RegExp('/web-hooks/*')
    const notificationPattern = new RegExp(
      '/notifications/send-push-notification-clock-work',
    )
    const scb2c2pWebhookPattern = new RegExp('/topup-transaction/2c2p/*')
    const topupPackagePattern = new RegExp('/topup-transaction/package')
    const emailSenderPattern = new RegExp('/email-sender/*')

    const isAuthModule = authPattern.test(originalUrl)
    const isUserOwnerRoute = userOwnerPattern.test(originalUrl)
    const isWebhookRoute = webhookPattern.test(originalUrl)
    const isSCB2c2pWebhookRoute = scb2c2pWebhookPattern.test(originalUrl)
    const isTopupPackagekRoute = topupPackagePattern.test(originalUrl)
    const isNotificationRoute = notificationPattern.test(originalUrl)
    const isEmailSenderRoute = emailSenderPattern.test(originalUrl)
    const authorization = headers['authorization'] || ''

    if (
      !authorization &&
      !isAuthModule &&
      !isUserOwnerRoute &&
      !isWebhookRoute &&
      !isNotificationRoute &&
      !isSCB2c2pWebhookRoute &&
      !isTopupPackagekRoute &&
      !isEmailSenderRoute
    ) {
      throw new UnauthorizedException()
    }
    let databaseName = MAIN_DATABASE_NAME
    if (
      !isAuthModule &&
      !isUserOwnerRoute &&
      !isWebhookRoute &&
      !isSCB2c2pWebhookRoute &&
      !isTopupPackagekRoute &&
      !isNotificationRoute &&
      !isEmailSenderRoute
    ) {
      const base64Credentials = authorization.split(' ')[1]
      try {
        const user = this.jwtService.verify(base64Credentials)
        // ถ้า admin ไม่มีมี company
        if (user.company) {
          databaseName = user.company
        }
      } catch (error) {
        if (error.name && error.name === 'TokenExpiredError') {
          throw new UnauthorizedException('token is expired')
        }
        throw new UnauthorizedException('token is invalid')
      }
    }

    const uri = `${this.configService.get<string>('MONGO_URI')}/${databaseName}?authSource=admin`

    return {
      uri,
      connectionFactory: async (connection: Connection) => {
        const cachingConnection = cachingConnections[connection.name]
        // NOTE: re-use connection
        if (!cachingConnection) {
          cachingConnections[connection.name] = connection
          return connection
        }
        await connection.close()
        return cachingConnection
      },
    }
  }
}
