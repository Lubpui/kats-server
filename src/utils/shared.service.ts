import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { UserResponse } from 'src/users/responses/user.response'
import * as bcrypt from 'bcrypt'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from 'src/users/schemas/user.schema'
import { createConnection, Model, Types } from 'mongoose'
import { ConfigService } from '@nestjs/config'
import { modelMapper } from './mapper.util'
import {
  Role,
  RoleDocument,
  RoleSchema,
} from 'src/permissions/schemas/role.schema'
import { LogInRequest } from 'src/auth/requests/login.request'

@Injectable()
export class SharedService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(signInRequest: LogInRequest): Promise<UserResponse> {
    const { email, password } = signInRequest
    const user = await this.userModel.findOne({ email })
    if (!user?._id) throw new NotFoundException('ไม่พบข้อมูลผู้ใช้งาน')

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new BadRequestException('ERR_AUTHENTICATE')

    return await this.getUserByDynamicallyType(user._id as any)
  }

  async getUserByDynamicallyType(
    value: string,
    type: '_id' | 'email' = '_id',
  ): Promise<UserResponse> {
    const pipeLine = {
      [`${type}`]: type === '_id' ? new Types.ObjectId(value) : value,
    }

    const user = await this.userModel.findOne(pipeLine, { password: 0 })
    if (!user) throw new NotFoundException('user not found')
    const dbname = user.dbname
    const connection = await createConnection(
      `${this.configService.get<string>('MONGO_URI')}/${dbname}?authSource=admin`,
    ).asPromise()
    try {
      const roleModel = connection.model<RoleDocument>(
        Role.name,
        RoleSchema as any,
      )
      const newUser: any = await roleModel.populate(user, { path: 'roleId' })
      return modelMapper(UserResponse, {
        ...newUser.toJSON(),
        dbname,
        role: newUser.roleId,
      })
    } catch (error) {
      throw error
    } finally {
      await connection.close()
    }
  }
}
