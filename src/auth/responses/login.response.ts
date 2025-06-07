import { Expose, Type } from 'class-transformer'
import { UserResponse } from 'src/users/responses/user.response'

export class LogInResponse {
  @Expose()
  @Type(() => UserResponse)
  user: UserResponse

  @Expose()
  accessToken: string

  @Expose()
  expiresIn: number

  @Expose()
  refreshToken: string

  @Expose()
  refreshExpiresIn: number
}
