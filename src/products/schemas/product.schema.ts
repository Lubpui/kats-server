import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
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
@Schema({ timestamps: true})
export class Product {
  @Prop({ required: true })
  name: string

  @Prop({
    required: true,
    type: ProductCatagorySchemaExcludeIndex,
  })
  catagory: ProductCatagory

  @Prop({
    required: true,
    type: [ProductDetailSchemaExcludeIndex],
  })
  productDetails: ProductDetail[]

  @Prop({
    required: true,
    type: TypeProductSchemaExcludeIndex,
  })
  typeProduct: TypeProduct

  @Prop({ enum: DeleteStatus, default: DeleteStatus.ISNOTDELETE })
  delete: number
}

const ProductSchema = SchemaFactory.createForClass(Product)

export { ProductSchema }
