import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { EmployeeRole } from 'src/shared/enums/employee.enum'

export type EmployeeDocument = Employee & Document

/**
 * ผนักงาน
 */
@Schema({ timestamps: true })
export class Employee {
  @Prop({ required: true })
  name: string

  @Prop({ required: true, enum: EmployeeRole })
  staffRole: number

  @Prop({ required: true })
  tel: string
}

const EmployeeSchema = SchemaFactory.createForClass(Employee)

export { EmployeeSchema }
