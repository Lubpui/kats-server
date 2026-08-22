import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { UploadFileRequest } from './requests/upload-file.request'
import * as fs from 'fs-extra'
import {
  cleanUpTempFiles,
  generateOriginalFileName,
  getUploadTempDir,
  resolveWithin,
  safeFileName,
} from 'src/utils/common.util'

// ไฟล์ที่อัพโหลดแล้วไม่ได้กดบันทึกภายใน 24 ชม. ถือว่าถูกทิ้งแล้ว
const TEMP_FILE_MAX_AGE_MS = 24 * 60 * 60 * 1000
const CLEAN_UP_INTERVAL_MS = 6 * 60 * 60 * 1000

@Injectable()
export class CoreService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CoreService.name)
  private cleanUpTimer?: NodeJS.Timeout

  onModuleInit() {
    void this.runCleanUp()

    this.cleanUpTimer = setInterval(
      () => void this.runCleanUp(),
      CLEAN_UP_INTERVAL_MS,
    )
    // ไม่ให้ timer กันไม่ให้ process ปิดตัว
    this.cleanUpTimer.unref()
  }

  onModuleDestroy() {
    if (this.cleanUpTimer) clearInterval(this.cleanUpTimer)
  }

  private async runCleanUp() {
    try {
      const deletedCount = await cleanUpTempFiles(TEMP_FILE_MAX_AGE_MS)

      if (deletedCount) {
        this.logger.log(`ลบไฟล์อัพโหลดค้างไป ${deletedCount} ไฟล์`)
      }
    } catch (error) {
      this.logger.warn(`ลบไฟล์อัพโหลดค้างไม่สำเร็จ: ${error?.message}`)
    }
  }

  // ถ้า run ใน windows ให้เปลี่ยน TMP_PATH ใน env เป็น C:\Users\<username>\AppData\Local\Temp
  async uploadFile(
    uploadFileRequest: UploadFileRequest,
  ): Promise<string | undefined> {
    const tempDir = getUploadTempDir()

    const isFirst = uploadFileRequest.index === 0
    const isLast = uploadFileRequest.index === uploadFileRequest.total - 1

    // session_id กับ original_name มาจาก client จึงต้องกรองก่อนเอาไปต่อเป็น path
    const tmpName = `upload_${safeFileName(uploadFileRequest.session_id)}`
    const tmpPathFile = resolveWithin(tempDir, tmpName)

    // NOTE: first upload
    if (isFirst && fs.existsSync(tmpPathFile)) {
      fs.unlinkSync(tmpPathFile)
    }

    if (!isFirst && !fs.existsSync(tmpPathFile)) {
      throw new BadRequestException('ไม่พบไฟล์ที่ต้องการอัพโหลด')
    }

    fs.appendFileSync(tmpPathFile, uploadFileRequest.content)

    if (isLast) {
      const originalName = safeFileName(uploadFileRequest.original_name)
      const newFileName = uploadFileRequest.is_use_orginal_name
        ? originalName
        : generateOriginalFileName(originalName)

      const base64Data = fs
        .readFileSync(tmpPathFile, 'utf-8')
        .replace(/^.*base64,/, '')

      fs.writeFileSync(
        resolveWithin(tempDir, newFileName),
        Buffer.from(base64Data, 'base64'),
        {
          encoding: 'binary',
        },
      )

      fs.unlinkSync(tmpPathFile)

      return newFileName
    }
  }
}
