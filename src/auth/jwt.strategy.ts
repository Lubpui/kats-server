import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { modelMapper } from 'src/utils/mapper.util'
import { UserResponse } from 'src/users/responses/user.response'
import { User, UserDocument } from './../users/schemas/user.schema'

import { Model } from 'mongoose'
import { JwtPayload } from './interfaces/jwt-payload.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: String(process.env.JWT_SIGN_PUBLIC_KEY).replace(
        /\\n/g,
        '\n',
      ),
      algorithm: <any>process.env.JWT_ALGORITHM,
    })
  }

  // เมื่อมีการเรียกใช้ Auth Guard จะทำการเรียกใช้ฟังก์ชัน validate ใน JwtStrategy และ return data ให้กับ reqeust.header.user
  async validate(payload: JwtPayload): Promise<UserResponse> {
    const { userId } = payload

    const user = await this.userModel.findById(userId, { password: 0 }).lean()
    if (!user) throw new NotFoundException('ไม่พบข้อมูลผู้ใช้งาน')
    return modelMapper(UserResponse, {
      ...user,
      dbname: user.dbname[0],
    })
  }
}
