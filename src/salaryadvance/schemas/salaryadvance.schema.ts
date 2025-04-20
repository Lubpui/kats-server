import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, Types } from 'mongoose'
import { Employee } from 'src/employees/schemas/employee.schema'
import { ExpenseCatagoryResponse } from 'src/expenses/responses/expense.response'
import { PaymentCategory } from 'src/shared/enums/expense.enum'

export type SalaryAdvanceDocument = SalaryAdvance & Document

/**
 * เบิกเงินเดือน
 */
@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class SalaryAdvance {
  @Prop({ required: true })
  number: number

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: Employee.name,
  })
  employeeId: Types.ObjectId

  @Prop({ required: true })
  ownerName: string

  @Prop({ enum: PaymentCategory, default: PaymentCategory.WITHDRAW })
  section: number

  @Prop({ required: true, type: [MongooseSchema.Types.Mixed] })
  categorys: [ExpenseCatagoryResponse]

  @Prop({ required: true })
  price: number

  @Prop({ required: true })
  date: string

  @Prop({ required: true })
  datePrice: string

  @Prop({ required: true })
  detel: string

  @Prop()
  slip: string
}

const SalaryAdvanceSchema = SchemaFactory.createForClass(SalaryAdvance)

SalaryAdvanceSchema.virtual('employee', {
  ref: 'Employee',
  localField: 'employeeId',
  foreignField: '_id',
  justOne: true,
})

export { SalaryAdvanceSchema }
