import { Expose, Type } from 'class-transformer'
import { IsEnum } from 'class-validator'
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
  staffRole: string

  @Expose()
  name: string

  @Expose()
  tel: string

  @Expose()
  image: string

  @Expose()
  salary: SalaryDetailResponse
}

export class EmployeeListResponse {
  @Expose()
  @Type(() => EmployeeResponse)
  data: EmployeeResponse[]
}
