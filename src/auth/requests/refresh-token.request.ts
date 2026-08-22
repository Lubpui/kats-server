import { IsNotEmpty, IsString } from 'class-validator'

export class RefreshTokenRequest {
  @IsString()
  @IsNotEmpty()
  refreshToken: string
}
