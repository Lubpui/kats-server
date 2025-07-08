import { Controller, Get, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { UserResponse } from './responses/user.response'
import { UserInfo } from 'src/shared/decorators/user-info.decorator'
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getUserProfile(@UserInfo() userInfo: UserResponse) {
    return this.usersService.getUserProfile(userInfo)
  }
}
