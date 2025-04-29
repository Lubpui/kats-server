import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type DocumentCountDocument = DocumentCount & Document

/**
 * เลขที่
 */
@Schema({ timestamps: true })
export class DocumentCount {
  @Prop({ default: 0 })
  expenseCount: number

  @Prop({ default: 0 })
  bookingCount: number
}

const DocumentCountSchema = SchemaFactory.createForClass(DocumentCount)

export { DocumentCountSchema }
