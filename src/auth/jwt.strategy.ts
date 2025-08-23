import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { modelMapper } from 'src/utils/mapper.util'
import { UserResponse } from 'src/users/responses/user.response'
import { User, UserDocument } from './../users/schemas/user.schema'

import { Model } from 'mongoose'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { MAIN_CONNECTION_NAME } from 'src/utils/constanrs'
import { ConfigService } from '@nestjs/config'
import fs from 'fs'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name, MAIN_CONNECTION_NAME)
    private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {
    const pubPath = configService.get<string>('JWT_SIGN_PUBLIC_KEY_PATH')
    let publicKey = ''

    if (pubPath) {
      try {
        publicKey = fs.readFileSync(pubPath, 'utf8')
      } catch (err) {
        console.error(
          'JwtStrategy: failed to read public key file at',
          pubPath,
          err,
        )
        // fallback to env if file read fails
        publicKey = String(
          configService.get('JWT_SIGN_PUBLIC_KEY') || '',
        ).replace(/\\n/g, '\n')
      }
    } else {
      publicKey = String(
        configService.get('JWT_SIGN_PUBLIC_KEY') || '',
      ).replace(/\\n/g, '\n')
    }

    if (!publicKey) {
      // ชัดเจนกว่าให้ throw ตอน boot ถ้าไม่มี public key
      throw new Error(
        'JWT public key not found. Set JWT_SIGN_PUBLIC_KEY_PATH or JWT_SIGN_PUBLIC_KEY.',
      )
    }

    const algorithm = configService.get<string>('JWT_ALGORITHM') || 'RS256'

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: publicKey,
      algorithms: <any>algorithm,
    })
  }

  // เมื่อมีการเรียกใช้ Auth Guard จะทำการเรียกใช้ฟังก์ชัน validate ใน JwtStrategy และ return data ให้กับ reqeust.header.user
  async validate(payload: JwtPayload): Promise<UserResponse> {
    const { userId } = payload

    const user = await this.userModel.findById(userId, { password: 0 }).lean()
    if (!user) throw new NotFoundException('ไม่พบข้อมูลผู้ใช้งาน')
    return modelMapper(UserResponse, {
      ...user,
      dbname: user.dbname,
    })
  }
}
