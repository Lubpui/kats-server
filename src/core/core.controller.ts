import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { CoreService } from './core.service'
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard'
import { UploadFileRequest } from './requests/upload-file.request'

@Controller('core')
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload-file')
  uploadLargeFile(@Body() uploadFileRequest: UploadFileRequest) {
    return this.coreService.uploadFile(uploadFileRequest)
  }
}
