import { IsNotEmpty } from 'class-validator'

export class LogInRequest {
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  password: string
}
