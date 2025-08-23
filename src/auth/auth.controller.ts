import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LogInRequest } from './requests/login.request'
import { CreateUserRequest } from 'src/users/requests/user.request'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginRequest: LogInRequest): Promise<any> {
    return this.authService.login(loginRequest)
  }

  @Post('register')
  createUser(@Body() createUserRequest: CreateUserRequest) {
    return this.authService.createNewAccount(createUserRequest)
  }
}
