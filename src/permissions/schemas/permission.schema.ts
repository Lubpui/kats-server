import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { PermissionKey } from 'src/shared/enums/permission-enum'

export type PermissionDocument = Permission & Document

/**
 * กำหนดสิทธิ์การใช้งาน
 */
@Schema({ timestamps: true, _id: false })
export class Permission {
  @Prop({ required: true })
  name: string

  @Prop({ required: true, enum: PermissionKey })
  key: number

  @Prop({ required: true })
  hasView: boolean

  @Prop({ required: true })
  hasEdit: boolean

  @Prop({ required: true })
  hasDelete: boolean
}

const PermissionSchema = SchemaFactory.createForClass(Permission)
const PermissionSchemaExcludeIndex = SchemaFactory.createForClass(Permission)

PermissionSchema.index({ key: 1 }, { unique: true })

export { PermissionSchema, PermissionSchemaExcludeIndex }
