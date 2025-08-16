import { Expose, Type } from 'class-transformer'
import { RoleLiteResponse } from 'src/permissions/responses/role.response'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'
import { SalaryInfoResponse } from './salaryInfo.response'

export class EmploymentInfoResponse {
  @Expose()
  roleId: string

  @Expose()
  role: RoleLiteResponse

  @Expose()
  @Type(() => SalaryInfoResponse)
  salaryInfo: SalaryInfoResponse
}

export class EmployeeResponse {
  @Expose()
  _id: string

  @Expose()
  firstName: string

  @Expose()
  lastName: string

  @Expose()
  tel: string

  @Expose()
  email: string

  @Expose()
  image: string

  @Expose()
  employmentInfo: EmploymentInfoResponse

  @Expose()
  delete: DeleteStatus
}


export class EmployeeListResponse {
  @Expose()
  @Type(() => EmployeeResponse)
  data: EmployeeResponse[]
}
