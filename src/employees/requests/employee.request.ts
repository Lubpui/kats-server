import { IsNotEmpty, IsOptional } from 'class-validator'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'
import { SalaryInfoResponse } from '../responses/salaryInfo.response'

export class EmploymentInfoRequest {
  @IsNotEmpty()
  roleId: string

  @IsOptional()
  salaryInfo?: SalaryInfoResponse
}

export class EmployeeRequest {
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

  @IsNotEmpty()
  employmentInfo: EmploymentInfoRequest

  @IsOptional()
  delete?: DeleteStatus
}
