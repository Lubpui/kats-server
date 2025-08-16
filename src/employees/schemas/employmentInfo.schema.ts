import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, Types } from 'mongoose'
import { Role } from 'src/permissions/schemas/role.schema'
import { SalaryInfo, SalaryInfoSchema } from './salaryInfo.schema'

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
    type: SalaryInfoSchema ,
  })
  salaryInfo: SalaryInfo
}

const EmploymentInfoSchema = SchemaFactory.createForClass(EmploymentInfo)
const EmploymentInfoSchemaExcludeIndex = SchemaFactory.createForClass(EmploymentInfo)

EmploymentInfoSchema.virtual('role', {
  ref: 'Role',
  localField: 'roleId',
  foreignField: '_id',
  justOne: true,
})

export { EmploymentInfoSchema, EmploymentInfoSchemaExcludeIndex }
