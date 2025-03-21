import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, Types } from 'mongoose'
import { ProductDetailResponse } from 'src/products/responses/product.response'
import { Product } from 'src/products/schemas/product.schema'
import { BookingStatus } from 'src/shared/enums/booking-status.enum'

export type BookingDocument = Booking & Document

/**
 * จองคิว
 */
@Schema({ timestamps: true })
export class Booking {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  number: string

  @Prop({ required: true })
  receiptBookNo: string

  @Prop({ required: true })
  bookDate: string

  @Prop({ required: true })
  bookTime: string

  @Prop({ required: true })
  carType: string

  @Prop({ required: true })
  carModel: string

  @Prop({ required: true })
  licensePlate: string //ทะเบียนรถ

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: Product.name,
  })
  product: Types.ObjectId

  @Prop({ enum: BookingStatus, default: BookingStatus.PENDING })
  status: number

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  price: ProductDetailResponse

  @Prop({ required: true })
  tel: string

  @Prop()
  image: string

  @Prop()
  slip: string
}

const BookingSchema = SchemaFactory.createForClass(Booking)

export { BookingSchema }
