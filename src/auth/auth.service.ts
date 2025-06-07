import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { LogInRequest } from './requests/login.request'
import { SharedService } from 'src/utils/shared.service'
import { createUserPayload } from 'src/utils/auth.util'
import { modelMapper } from 'src/utils/mapper.util'
import { LogInResponse } from './responses/login.response'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sharedService: SharedService,
  ) {}

  async login(loginRequest: LogInRequest): Promise<any> {
    try {
      const user = await this.sharedService.validateUser(loginRequest)
      const newPayload = createUserPayload(user, this.jwtService, false)
      return modelMapper(LogInResponse, newPayload)
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
