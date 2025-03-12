import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type ProductCatagoryDocument = ProductCatagory & Document

/**
 * หมวดหมู่ สินค้า
 */
@Schema({ timestamps: true })
export class ProductCatagory {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  code: string
}

const ProductCatagorySchema = SchemaFactory.createForClass(ProductCatagory)

export { ProductCatagorySchema }
