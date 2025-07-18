import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'
import { EmploymentInfoSchemaExcludeIndex, EmploymentInfo } from './employmentInfo.schema'

export type EmployeeDocument = Employee & Document

/**
 * ผนักงาน
 */
@Schema({ timestamps: true })
export class Employee {
  @Prop({ required: true })
  firstName: string

  @Prop({ required: true })
  lastName: string

  @Prop({ required: true })
  tel: string

  @Prop()
  email: string

  @Prop()
  image: string

  @Prop({ type: EmploymentInfoSchemaExcludeIndex })
  employmentInfo: EmploymentInfo

  @Prop({ default: DeleteStatus.ISNOTDELETE, enum: DeleteStatus })
  delete: DeleteStatus
}

const EmployeeSchema = SchemaFactory.createForClass(Employee)

export { EmployeeSchema }
