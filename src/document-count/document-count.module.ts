import { Module } from '@nestjs/common'
import { DocumentCountService } from './document-count.service'
import { DocumentCountController } from './document-count.controller'
import { MongooseModule } from '@nestjs/mongoose'
import {
  DocumentCount,
  DocumentCountSchema,
} from './schemas/document-count.schema'

export const DocumentCountsMongoose = MongooseModule.forFeature([
  { name: DocumentCount.name, schema: DocumentCountSchema },
])

@Module({
  imports: [DocumentCountsMongoose],
  controllers: [DocumentCountController],
  providers: [DocumentCountService],
  exports: [DocumentCountService],
})
export class DocumentCountModule {}
