import { IsNotEmpty, IsOptional } from 'class-validator'
import { SalaryDetailResponse } from '../responses/employee.response'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'

export class EmployeeRequest {
  @IsNotEmpty()
  roleId: string

  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  tel: string

  @IsOptional()
  image?: string

  @IsOptional()
  salary?: SalaryDetailResponse

  @IsOptional()
  delete?: DeleteStatus
}
