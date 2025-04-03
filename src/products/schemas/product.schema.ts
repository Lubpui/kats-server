import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, Types } from 'mongoose'
import { ProductType } from 'src/shared/enums/product.enum'
import { ProductCatagory } from './product-catagory.schema'
import { ProductDetailResponse } from '../responses/product.response'

export type ProductDocument = Product & Document

/**
 * สินค้า
 */
@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Product {
  @Prop({ required: true })
  name: string

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: ProductCatagory.name,
  })
  catagoryId: Types.ObjectId

  @Prop({
    required: true,
    type: [MongooseSchema.Types.Mixed],
  })
  productDetails: ProductDetailResponse[]

  @Prop({ enum: ProductType, default: ProductType.KATS })
  productType: number
}

const ProductSchema = SchemaFactory.createForClass(Product)

ProductSchema.virtual('catagory', {
  ref: 'ProductCatagory',
  localField: 'catagoryId',
  foreignField: '_id',
  justOne: true,
})

export { ProductSchema }
