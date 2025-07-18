import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'

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

  @Prop({ enum: DeleteStatus, default: DeleteStatus.ISNOTDELETE })
  delete: number
}

const ProductCatagorySchema = SchemaFactory.createForClass(ProductCatagory)
const ProductCatagorySchemaExcludeIndex = SchemaFactory.createForClass(ProductCatagory)

export { ProductCatagorySchema, ProductCatagorySchemaExcludeIndex }
