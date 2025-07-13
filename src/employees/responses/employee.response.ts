import { Expose, Type } from 'class-transformer'
import { IsEnum } from 'class-validator'
import { RoleLiteResponse } from 'src/permissions/responses/role.response'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'
import {
  BankType,
  PaymentStatus,
  PaymentType,
} from 'src/shared/enums/employee.enum'

export class SalaryDetailResponse {
  @Expose()
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus

  @Expose()
  @IsEnum(PaymentType)
  paymentType: PaymentType

  @Expose()
  @IsEnum(BankType)
  bankName: BankType

  @Expose()
  accountNumber: string

  @Expose()
  amount: number
}
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
  salary: SalaryDetailResponse

  @Expose()
  delete: DeleteStatus
}

export class EmployeeListResponse {
  @Expose()
  @Type(() => EmployeeResponse)
  data: EmployeeResponse[]
}
