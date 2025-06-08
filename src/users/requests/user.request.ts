import { IsNotEmpty, IsOptional } from 'class-validator'

export class UserRequest {
  @IsNotEmpty()
  userName: string

  @IsNotEmpty()
  firstName: string

  @IsNotEmpty()
  lastName: string

  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  password: string

  @IsNotEmpty()
  companyName: string

  @IsOptional()
  phoneNumber?: string

  @IsOptional()
  nickName?: string
}

export class CreateUserRequest extends UserRequest {}
