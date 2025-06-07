import { IsEmail, IsNotEmpty } from 'class-validator'

export class LogInRequest {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string
}
