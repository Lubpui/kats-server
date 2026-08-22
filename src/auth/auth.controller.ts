import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LogInRequest } from './requests/login.request'
import { RefreshTokenRequest } from './requests/refresh-token.request'
import { ThrottlerGuard } from '@nestjs/throttler'
import { CreateUserRequest } from 'src/users/requests/user.request'
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard'
import { ChangePasswordRequest } from './requests/change-password.request'
import { UserInfo } from 'src/shared/decorators/user-info.decorator'
import { UserResponse } from 'src/users/responses/user.response'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // จำกัด 5 ครั้ง/นาที ต่อ IP กัน brute force
  @UseGuards(ThrottlerGuard)
  @Post('login')
  async login(@Body() loginRequest: LogInRequest) {
    return this.authService.login(loginRequest)
  }

  @Post('refresh-token')
  refreshToken(@Body() refreshTokenRequest: RefreshTokenRequest) {
    return this.authService.refreshToken(refreshTokenRequest)
  }

  @Post('register')
  createUser(@Body() createUserRequest: CreateUserRequest) {
    return this.authService.createNewAccount(createUserRequest)
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @UserInfo() userInfo: UserResponse,
    @Body() changePasswordRequest: ChangePasswordRequest,
  ) {
    return this.authService.changePassword(userInfo._id, changePasswordRequest)
  }
}
