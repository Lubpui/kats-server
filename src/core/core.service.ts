import { BadRequestException, Injectable } from '@nestjs/common'
import { UploadFileRequest } from './requests/upload-file.request'
import path from 'path'
import { ConfigService } from '@nestjs/config'
import * as fs from 'fs-extra'
import { generateOriginalFileName } from 'src/utils/common.util'

@Injectable()
export class CoreService {
  constructor(private readonly configService: ConfigService) {}

  // ถ้า run ใน windows ให้เปลี่ยน TMP_PATH ใน env เป็น C:\Users\<username>\AppData\Local\Temp
  async uploadFile(
    uploadFileRequest: UploadFileRequest,
  ): Promise<string | undefined> {
    try {
      const isFirst = uploadFileRequest.index === 0
      const isLast = uploadFileRequest.index === uploadFileRequest.total - 1
      const tmpName = `upload_${uploadFileRequest.session_id}`
      const tmpPathFile = path.join(this.configService.get('TMP_PATH') ?? '', tmpName)
      
      // NOTE: first upload
      if (isFirst && fs.existsSync(tmpPathFile)) {
        fs.unlinkSync(tmpPathFile)
      }

      if (!isFirst && !fs.existsSync(tmpPathFile)) {
        throw new BadRequestException('ไม่พบไฟล์ที่ต้องการอัพโหลด')
      }

      fs.appendFileSync(tmpPathFile, uploadFileRequest.content)

      if (isLast) {
        const newFileName = uploadFileRequest.is_use_orginal_name
          ? uploadFileRequest.original_name
          : generateOriginalFileName(uploadFileRequest.original_name)
        const base64Data = fs
          .readFileSync(tmpPathFile, 'utf-8')
          .replace(/^.*base64,/, '')

        fs.writeFileSync(
          path.join(this.configService.get('TMP_PATH') ?? '', newFileName),
          Buffer.from(base64Data, 'base64'),
          {
            encoding: 'binary',
          },
        )

        fs.unlinkSync(tmpPathFile)

        return newFileName
      }
    } catch (error) {
      throw error
    }
  }
}
