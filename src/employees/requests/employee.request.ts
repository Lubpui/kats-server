import { IsNotEmpty } from 'class-validator'

export class EmployeeRequest {
  @IsNotEmpty()
  staffRole: string

  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  tel: string
}
