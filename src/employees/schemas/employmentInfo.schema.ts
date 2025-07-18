import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, Types } from 'mongoose'
import { Role } from 'src/permissions/schemas/role.schema'
import { SalaryInfoSchema } from './salaryInfo.schema'
import { SalaryInfoResponse } from '../responses/salaryInfo.response'

export type EmploymentInfoDocument = EmploymentInfo & Document

/**
 * รายละเอียดผนักงาน
 */
@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class EmploymentInfo {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: Role.name,
  })
  roleId: Types.ObjectId

  @Prop({
    required: true,
    type: { SalaryInfoSchema },
  })
  salaryInfo: SalaryInfoResponse
}

const EmploymentInfoSchema = SchemaFactory.createForClass(EmploymentInfo)

export { EmploymentInfoSchema }
