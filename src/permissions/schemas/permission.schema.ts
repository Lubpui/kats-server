import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { PermissionKey } from 'src/shared/enums/permission-enum'

export type PermissionDocument = Permission & Document

/**
 * กำหนดสิทธิ์การใช้งาน
 */
@Schema({ timestamps: true, toJSON: { virtuals: true } })
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

export { PermissionSchema }
