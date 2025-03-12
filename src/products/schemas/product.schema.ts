import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, Types } from 'mongoose'
import { ProductDetail } from './product-detail.schema'
import { ProductType } from 'src/shared/enums/product.enum'
import { ProductCatagory } from './product-catagory.schema'

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
  catagories: Types.ObjectId

  @Prop({
    required: true,
    type: [MongooseSchema.Types.ObjectId],
    ref: ProductDetail.name,
  })
  productDetails: Types.ObjectId[]

  @Prop({ enum: ProductType, default: ProductType.KATS })
  productType: number
}

const ProductSchema = SchemaFactory.createForClass(Product)

export { ProductSchema }
