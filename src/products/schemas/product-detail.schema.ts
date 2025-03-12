import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { PriceType } from 'src/shared/enums/product.enum'

export type ProductDetailDocument = ProductDetail & Document

/**
 * รายละเอียด สินค้า
 */
@Schema({ timestamps: true })
export class ProductDetail {
  @Prop({ required: true, enum: PriceType })
  type: number

  @Prop({ required: true })
  price: number
}

const ProductDetailSchema = SchemaFactory.createForClass(ProductDetail)

export { ProductDetailSchema }
