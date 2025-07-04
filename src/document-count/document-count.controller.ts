import { Body, Controller, Get, Post } from '@nestjs/common'
import { DocumentCountService } from './document-count.service'
import { DocumentCountRequest } from './requsets/document-count.requset'
import { DocumentCountResponse } from './responses/document-count.response'

@Controller('document-count')
export class DocumentCountController {
  constructor(private readonly documentCountService: DocumentCountService) {}

  @Post()
  createDocumentCount(
    @Body() createDocumentCount: DocumentCountRequest,
  ): Promise<DocumentCountResponse> {
    return this.documentCountService.createDocumentCount(createDocumentCount)
  }

  @Get()
  getAllDocumentCount(): Promise<DocumentCountResponse[]> {
    return this.documentCountService.getAllDocumentCount()
  }
}
