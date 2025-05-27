import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { PermissionKey } from 'src/shared/enums/permission-enum'
import { Permission, PermissionSchema } from './permission.schema'

export type RoleDocument = Role & Document

/**
 * กำหนดตำแหน่งพนักงงาน
 */
@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Role {
  @Prop({ required: true })
  name: string

  @Prop({
    required: true,
    type: PermissionSchema,
  })
  permissions: Permission[]

  @Prop({ required: true, enum: PermissionKey })
  type: number
}

const RoleSchema = SchemaFactory.createForClass(Role)

export { RoleSchema }
