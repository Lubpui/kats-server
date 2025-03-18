import { IsNotEmpty } from 'class-validator'

export class EmployeeResquest {
  @IsNotEmpty()
  staffRole: string

  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  tel: string
}
