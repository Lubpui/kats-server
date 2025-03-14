import { IsNotEmpty } from 'class-validator'

export class EmployeeResquest {
  @IsNotEmpty()
  position: string

  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  code: string
}
