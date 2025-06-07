import { Injectable } from '@nestjs/common'
import { CreateUserRequest } from './requests/user.request'
import { User, UserDocument } from './schemas/user.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { modelMapper } from 'src/utils/mapper.util'
import { UserResponse } from './responses/user.response'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserRequest: CreateUserRequest) {
    const createdUser = await new this.userModel(createUserRequest).save()
    return modelMapper(UserResponse, createdUser)
  }
}
