import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { EmployeeRole } from 'src/shared/enums/employee.enum'
import { SalaryDetailResponse } from '../responses/employee.response'

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

  @Prop()
  image: string

  @Prop({ type: MongooseSchema.Types.Mixed })
  salary: SalaryDetailResponse
}

const EmployeeSchema = SchemaFactory.createForClass(Employee)

export { EmployeeSchema }
