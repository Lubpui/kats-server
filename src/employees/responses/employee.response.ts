import { Expose, Type } from 'class-transformer'
import { RoleLiteResponse } from 'src/permissions/responses/role.response'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'
import { SalaryInfoResponse } from './salaryInfo.response'

export class EmployeeResponse {
  @Expose()
  _id: string

  @Expose()
  roleId: string

  @Expose()
  role: RoleLiteResponse

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
  salary: SalaryInfoResponse

  @Expose()
  delete: DeleteStatus
}

export class EmployeeListResponse {
  @Expose()
  @Type(() => EmployeeResponse)
  data: EmployeeResponse[]
}
