import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'

export type TypeProductDocument = TypeProduct & Document

/**
 * แบรนด์ สินค้า
 */
@Schema({ timestamps: true })
export class TypeProduct {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  code: string

  @Prop({ enum: DeleteStatus, default: DeleteStatus.ISNOTDELETE })
  delete: number
}

const TypeProductSchema = SchemaFactory.createForClass(TypeProduct)
const TypeProductSchemaExcludeIndex = SchemaFactory.createForClass(TypeProduct)

export { TypeProductSchema, TypeProductSchemaExcludeIndex }
