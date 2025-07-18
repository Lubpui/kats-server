import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { BookingStatus } from 'src/shared/enums/booking-status.enum'

export type GuaranteeDocument = Guarantee & Document

/**
 * การรับประกันการเข้ารับบริการ
 */
@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Guarantee {
  @Prop({ required: true })
  serviceNo: number // ครั้งที่

  @Prop({ required: true })
  serviceDate: string // วันที่เข้ารับบริการ

  @Prop({ required: true })
  serviceTime: string // เวลาเข้ารับบริการ

  @Prop({ enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus // วันที่เข้ารับบริการ

  @Prop({ required: true })
  isBeam: boolean // คาน

  @Prop({ required: true })
  isWheelArch: boolean // ซุ้มล้อ

  @Prop({ required: true })
  isControlArm: boolean // ปีกนก

  @Prop({ required: true })
  isChassis: boolean // แชสซี่ส์

  @Prop({ required: true })
  isUnderbody: boolean // ใต้ท้อง
}

const GuaranteeSchema = SchemaFactory.createForClass(Guarantee)

export { GuaranteeSchema }
