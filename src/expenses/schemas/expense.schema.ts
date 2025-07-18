import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, Types } from 'mongoose'
import { Employee } from 'src/employees/schemas/employee.schema'
import { ExpenseStatus, PaymentCategory } from 'src/shared/enums/expense.enum'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'
import { ExpenseCatagory, ExpenseCatagorySchemaExcludeIndex } from './expense-catagory.schema'

export type ExpenseDocument = Expense & Document

/**
 * ค่าใช้จ่าย
 */
@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Expense {
  @Prop({ required: true })
  codeId: string

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

  @Prop({ required: true, type: [ExpenseCatagorySchemaExcludeIndex] })
  categorys: ExpenseCatagory[]

  @Prop({ required: true })
  date: string

  @Prop()
  datePrice: string

  @Prop({ required: true })
  detel: string

  @Prop()
  slip: string

  @Prop({ enum: DeleteStatus, default: DeleteStatus.ISNOTDELETE })
  delete: number

  @Prop({ enum: ExpenseStatus, default: ExpenseStatus.PENDING })
  status: number
}

const ExpenseSchema = SchemaFactory.createForClass(Expense)

ExpenseSchema.virtual('employee', {
  ref: 'Employee',
  localField: 'employeeId',
  foreignField: '_id',
  justOne: true,
})

export { ExpenseSchema }
