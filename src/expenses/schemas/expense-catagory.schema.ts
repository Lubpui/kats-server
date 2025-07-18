import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { CategoryType } from 'src/shared/enums/expense.enum'

export type ExpenseCatagoryDocument = ExpenseCatagory & Document

/**
 * ประเภทค่าใช้จ่าย
 */
@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class ExpenseCatagory {
  @Prop({ enum: CategoryType, default: CategoryType.FUEL })
  type: CategoryType

  @Prop({ required: true })
  amount: number
}

const ExpenseCatagorySchema = SchemaFactory.createForClass(ExpenseCatagory)

export { ExpenseCatagorySchema }
