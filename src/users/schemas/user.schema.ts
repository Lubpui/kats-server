import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Schema as MongooseSchema, Types } from 'mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document

/**
 * ผู้ใช้งาน
 */
@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class User {
  @Prop({ required: true })
  userName: string

  @Prop({ required: true })
  firstName: string

  @Prop({ required: true })
  lastName: string

  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop()
  nickName: string

  @Prop()
  dbname: string

  @Prop()
  phoneNumber: string

  @Prop({ required: true, default: false })
  isOwner: boolean

  @Prop({ required: true })
  companyName: string

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role' })
  roleId: Types.ObjectId
}

const UserSchema = SchemaFactory.createForClass(User)

UserSchema.index({ email: 1 }, { unique: true })

UserSchema.virtual('role', {
  ref: 'Role',
  localField: 'roleId',
  foreignField: '_id',
})

export { UserSchema }
