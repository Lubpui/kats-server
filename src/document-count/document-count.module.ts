import { Module } from '@nestjs/common'
import { DocumentCountService } from './document-count.service'
import { DocumentCountController } from './document-count.controller'
import { MongooseModule } from '@nestjs/mongoose'
import {
  DocumentCount,
  DocumentCountSchema,
} from './schemas/document-count.schema'
import { CUSTOM_CONNECTION_NAME } from 'src/utils/constanrs'
import { ConfigModule } from '@nestjs/config'

export const DocumentCountsMongoose = MongooseModule.forFeature(
  [{ name: DocumentCount.name, schema: DocumentCountSchema }],
  CUSTOM_CONNECTION_NAME,
)

@Module({
  imports: [DocumentCountsMongoose, ConfigModule],
  controllers: [DocumentCountController],
  providers: [DocumentCountService],
  exports: [DocumentCountService],
})
export class DocumentCountModule {}
