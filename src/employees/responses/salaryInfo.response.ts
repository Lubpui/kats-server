import { Expose } from 'class-transformer'
import { IsEnum } from 'class-validator'
import {
  BankType,
  PaymentStatus,
  PaymentType,
} from 'src/shared/enums/employee.enum'

export class SalaryInfoResponse {
  @Expose()
  _id: string

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
