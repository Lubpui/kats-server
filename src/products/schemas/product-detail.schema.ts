import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type ProductDetailDocument = ProductDetail & Document

/**
 * รายละเอียด สินค้า
 */
@Schema()
export class ProductDetail {
  @Prop({ required: true })
  type: string

  @Prop({ required: true })
  amount: string
}

const ProductDetailSchema = SchemaFactory.createForClass(ProductDetail)
const ProductDetailSchemaExcludeIndex =
  SchemaFactory.createForClass(ProductDetail)

export { ProductDetailSchema, ProductDetailSchemaExcludeIndex }
