import { IsNotEmpty, IsOptional } from 'class-validator'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'
import { SalaryInfoResponse } from '../responses/salaryInfo.response'

export class EmployeeRequest {
  @IsNotEmpty()
  roleId: string

  @IsNotEmpty()
  firstName: string

  @IsNotEmpty()
  lastName: string

  @IsNotEmpty()
  tel: string

  @IsOptional()
  email?: string

  @IsOptional()
  image?: string

  @IsOptional()
  salary?: SalaryInfoResponse

  @IsOptional()
  delete?: DeleteStatus
}
