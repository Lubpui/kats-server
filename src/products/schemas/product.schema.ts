import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, Types } from 'mongoose'
import { ProductType } from 'src/shared/enums/product.enum'
import { ProductCatagory } from './product-catagory.schema'
import { ProductDetailResponse } from '../responses/product.response'

export type ProductDocument = Product & Document

/**
 * สินค้า
 */
@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: ProductCatagory.name,
  })
  catagory: Types.ObjectId

  @Prop({
    required: true,
    type: [MongooseSchema.Types.Mixed],
  })
  productDetails: ProductDetailResponse[]

  @Prop({ enum: ProductType, default: ProductType.KATS })
  productType: number
}

const ProductSchema = SchemaFactory.createForClass(Product)

export { ProductSchema }
