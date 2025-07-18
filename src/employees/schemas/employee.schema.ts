import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, Types } from 'mongoose'
import { Role } from 'src/permissions/schemas/role.schema'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'
import { SalaryInfoResponse } from '../responses/salaryInfo.response'
import { SalaryInfoSchema } from './salaryInfo.schema'

export type EmployeeDocument = Employee & Document

/**
 * ผนักงาน
 */
@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Employee {
  @Prop({ required: true })
  firstName: string

  @Prop({ required: true })
  lastName: string

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: Role.name,
  })
  roleId: Types.ObjectId

  @Prop({ required: true })
  tel: string

  @Prop()
  email: string

  @Prop()
  image: string

  @Prop({ type: SalaryInfoSchema })
  salary: SalaryInfoResponse

  @Prop({ default: DeleteStatus.ISNOTDELETE, enum: DeleteStatus })
  delete: DeleteStatus
}

const EmployeeSchema = SchemaFactory.createForClass(Employee)

EmployeeSchema.virtual('role', {
  ref: 'Role',
  localField: 'roleId',
  foreignField: '_id',
  justOne: true,
})

export { EmployeeSchema }
