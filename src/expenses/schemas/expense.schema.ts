import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, Types } from 'mongoose'
import { Employee } from 'src/employees/schemas/employee.schema'
import { PaymentCategory } from 'src/shared/enums/expense.enum'
import { ExpenseCatagoryResponse } from '../responses/expense.response'

export type ExpenseDocument = Expense & Document

/**
 * ค่าใช้จ่าย
 */
@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Expense {
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
}

const ExpenseSchema = SchemaFactory.createForClass(Expense)

ExpenseSchema.virtual('employee', {
  ref: 'Employee',
  localField: 'employeeId',
  foreignField: '_id',
  justOne: true,
})

export { ExpenseSchema }
