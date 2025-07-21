import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, Types } from 'mongoose'
import {
  ProductCatagory,
  ProductCatagorySchemaExcludeIndex,
} from './product-catagory.schema'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'
import {
  TypeProduct,
  TypeProductSchemaExcludeIndex,
} from './product-typeproduct.schema'
import {
  ProductDetail,
  ProductDetailSchemaExcludeIndex,
} from './product-detail.schema'

export type ProductDocument = Product & Document

/**
 * สินค้า
 */
@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Product {
  @Prop({ required: true })
  name: string

  @Prop({
    type: ProductCatagorySchemaExcludeIndex,
  })
  catagorySnapshot: ProductCatagory

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: ProductCatagory.name,
  })
  catagoryId: Types.ObjectId

  @Prop({
    required: true,
    type: [ProductDetailSchemaExcludeIndex],
  })
  productDetails: ProductDetail[]

  @Prop({
    type: TypeProductSchemaExcludeIndex,
  })
  typeProductSnapshot: TypeProduct

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: TypeProduct.name,
  })
  typeProductId: Types.ObjectId

  @Prop({ enum: DeleteStatus, default: DeleteStatus.ISNOTDELETE })
  delete: number
}

const ProductSchema = SchemaFactory.createForClass(Product)
const ProductSchemaExcludeImdex = SchemaFactory.createForClass(Product)

ProductSchema.virtual('catagory', {
  ref: 'ProductCatagory',
  localField: 'catagoryId',
  foreignField: '_id',
  justOne: true,
})

ProductSchema.virtual('typeProduct', {
  ref: 'TypeProduct',
  localField: 'typeProductId',
  foreignField: '_id',
  justOne: true,
})

export { ProductSchema, ProductSchemaExcludeImdex }
