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
import { loadJwtPublicKey } from 'src/utils/jwt-keys.util'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name, MAIN_CONNECTION_NAME)
    private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {
    // ไม่มี key ก็ให้ throw ตั้งแต่ boot ชัดเจนกว่าไปพังตอน verify token
    const publicKey = loadJwtPublicKey(configService)
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
