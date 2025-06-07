import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LogInRequest } from './requests/login.request'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginRequest: LogInRequest): Promise<any> {
    return this.authService.login(loginRequest)
  }
}
