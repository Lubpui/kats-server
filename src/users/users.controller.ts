import { Controller, Post, Body } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserRequest } from './requests/user.request'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  createUser(@Body() createUserRequest: CreateUserRequest) {
    return this.usersService.createNewAccount(createUserRequest)
  }
}
