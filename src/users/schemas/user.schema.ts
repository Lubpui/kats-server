import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import * as bcrypt from 'bcrypt'

export type UserDocument = User & Document

/**
 * ผู้ใช้งาน
 */
@Schema({ timestamps: true })
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
}

const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

export { UserSchema }
