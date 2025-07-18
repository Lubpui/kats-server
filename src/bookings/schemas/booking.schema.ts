import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, Types } from 'mongoose'
import { Product } from 'src/products/schemas/product.schema'
import { BookingStatus } from 'src/shared/enums/booking-status.enum'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'
import { Guarantee, GuaranteeSchemaExcludeIndex } from './guarantee.schema'
import { ProductDetailSchemaExcludeIndex, ProductDetail } from 'src/products/schemas/product-detail.schema'

export type BookingDocument = Booking & Document

/**
 * จองคิว
 */
@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Booking {
  @Prop({ required: true })
  codeId: string

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

  @Prop({ required: true })
  province: string //ทะเบียนจังหวัด

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: Product.name,
  })
  productId: Types.ObjectId

  @Prop({ enum: BookingStatus, default: BookingStatus.PENDING })
  status: number

  @Prop({ required: true, type: ProductDetailSchemaExcludeIndex })
  price: ProductDetail

  @Prop({ required: true, type: [GuaranteeSchemaExcludeIndex] })
  guarantees: Guarantee[]

  @Prop({ required: true })
  tel: string

  @Prop()
  image: string

  @Prop()
  slip: string

  @Prop({ enum: DeleteStatus, default: DeleteStatus.ISNOTDELETE })
  delete: number
}

const BookingSchema = SchemaFactory.createForClass(Booking)

BookingSchema.virtual('product', {
  ref: 'Product',
  localField: 'productId',
  foreignField: '_id',
  justOne: true,
})

export { BookingSchema }
