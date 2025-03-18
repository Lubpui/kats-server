import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, Types } from 'mongoose'

export type EmployeeDocument = Employee & Document

/**
 * ผนักงาน
 */
@Schema({ timestamps: true })
export class Employee {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  staffRole: string

  @Prop({ required: true })
  tel: string
}

const EmployeeSchema = SchemaFactory.createForClass(Employee)

export { EmployeeSchema }
