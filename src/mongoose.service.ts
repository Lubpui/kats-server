import {
  BadRequestException,
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

// path เดียวที่เปิดให้เข้าถึงได้โดยไม่ต้องมี token (หน้าจองสาธารณะ)
const PREVIEW_PATH = '/bookings/preview'

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

    // ตัด query string ทิ้งก่อน ไม่งั้น path ที่มีคำว่า /preview อยู่ใน query จะหลุด auth ไปด้วย
    const [pathName] = originalUrl.split('?')

    const isAuthModule = /^\/auth(\/.*)?$/.test(pathName)
    const isPreviewModule = pathName === PREVIEW_PATH
    const authorization = headers['authorization'] || ''

    if (!authorization && !isAuthModule && !isPreviewModule) {
      throw new UnauthorizedException()
    }

    let databaseName = MAIN_DATABASE_NAME

    //ถ้าเข้ามาใน path /auth ทั้งหมดจะไม่เข้าเงื่อนไขการสวิช database
    if (!isAuthModule && !isPreviewModule) {
      const base64Credentials = authorization.split(' ')[1]
      try {
        const user = this.jwtService.verify(base64Credentials)
        // ถ้าไม่มีมี company
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

    if (isPreviewModule) {
      const urlParams = new URLSearchParams(originalUrl.split('?')[1])
      const companyName = urlParams.get('companyName')

      if (!companyName) {
        throw new BadRequestException('invalid companyName')
      }

      databaseName = companyName || 'KATS_LadKrabang'
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
