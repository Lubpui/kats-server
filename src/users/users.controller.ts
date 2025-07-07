import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserRequest } from './requests/user.request'
import { UserResponse } from './responses/user.response'
import { UserInfo } from 'src/shared/decorators/user-info.decorator'
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  createUser(@Body() createUserRequest: CreateUserRequest) {
    return this.usersService.createNewAccount(createUserRequest)
  }

  @Get('profile')
  getUserProfile(@UserInfo() userInfo: UserResponse) {
    return this.usersService.getUserProfile(userInfo)
  }
}
