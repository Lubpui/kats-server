import { IsNotEmpty, IsOptional } from 'class-validator'
import { SalaryDetailResponse } from '../responses/employee.response'

export class EmployeeRequest {
  @IsNotEmpty()
  staffRole: string

  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  tel: string

  @IsOptional()
  image?: string

  @IsOptional()
  salary?: SalaryDetailResponse
}
