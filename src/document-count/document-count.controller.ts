import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { DocumentCountService } from './document-count.service'
import { DocumentCountRequest } from './requsets/document-count.requset'
import { DocumentCountResponse } from './responses/document-count.response'
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
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
