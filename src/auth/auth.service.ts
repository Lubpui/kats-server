import { Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { LogInRequest } from './requests/login.request'
import { SharedService } from 'src/utils/shared.service'
import { createUserPayload } from 'src/utils/auth.util'
import { modelMapper } from 'src/utils/mapper.util'
import { LogInResponse } from './responses/login.response'
import { CreateUserRequest } from 'src/users/requests/user.request'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sharedService: SharedService,
    private readonly userService: UsersService,
  ) {}

  async login(loginRequest: LogInRequest) {
    try {
      const user = await this.sharedService.validateUser(loginRequest)
      throw new NotFoundException('Login failed3')
      const newPayload = createUserPayload(user, this.jwtService, false)
      return modelMapper(LogInResponse, newPayload)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async createNewAccount(createUserRequest: CreateUserRequest) {
    const newUser = await this.userService.createNewAccount(createUserRequest)
    return newUser
  }
}
