import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import {
  BankType,
  PaymentStatus,
  PaymentType,
} from 'src/shared/enums/employee.enum'

export type SalaryInfoDocument = SalaryInfo & Document

/**
 * รายละเอียดการเงินของพนักงาน
 */
@Schema({ timestamps: true })
export class SalaryInfo {
  @Prop({ enum: PaymentStatus, default: PaymentStatus.CASH })
  paymentStatus: number

  @Prop({ enum: PaymentType, default: PaymentType.MONTHLY })
  paymentType: number

  @Prop({ enum: BankType, default: BankType.BANK_OF_AYUDHYA })
  bankName: number

  @Prop()
  accountNumber: number

  @Prop()
  amount: number
}

const SalaryInfoSchema = SchemaFactory.createForClass(SalaryInfo)

export { SalaryInfoSchema }
