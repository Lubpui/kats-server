import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Permission, PermissionSchemaExcludeIndex } from './permission.schema'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'
export type RoleDocument = Role & Document

/**
 * กำหนดตำแหน่งพนักงงาน
 */
@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Role {
  @Prop({ required: true, unique: true })
  name: string

  @Prop({
    required: true,
    type: [PermissionSchemaExcludeIndex],
  })
  permissions: Permission[]

  @Prop({ required: true })
  type: string

  @Prop({ enum: DeleteStatus, default: DeleteStatus.ISNOTDELETE })
  delete: number
}

const RoleSchema = SchemaFactory.createForClass(Role)

export { RoleSchema }
