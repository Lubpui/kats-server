import { BadRequestException } from '@nestjs/common'
import path, { extname } from 'path'
import * as fs from 'fs-extra'

export const generateOriginalFileName = (fileName: string): string => {
  const imageName = String(fileName).split('.')[0]
  const fileExtName = extname(fileName)
  return `${imageName}-${new Date().getTime()}${fileExtName}`
}

/**
 * ตัดชื่อไฟล์ที่รับมาจาก client ให้เหลือเฉพาะชื่อไฟล์จริง
 * กันไม่ให้ส่ง '../../.env' เข้ามาแล้วอ่าน/เขียนไฟล์นอกโฟลเดอร์ที่ตั้งใจ
 */
export const safeFileName = (fileName: string): string => {
  // แปลง \ เป็น / ก่อน เพราะบน linux path.basename ไม่ถือว่า \ เป็นตัวคั่น
  const baseName = path.basename(String(fileName).replace(/\\/g, '/')).trim()

  if (!baseName || baseName === '.' || baseName === '..') {
    throw new BadRequestException('ชื่อไฟล์ไม่ถูกต้อง')
  }

  return baseName
}

/**
 * รวม path แล้วยืนยันว่าผลลัพธ์ยังอยู่ใต้ dirname จริง ๆ
 */
export const resolveWithin = (dirname: string, fileName: string): string => {
  const rootPath = path.resolve(dirname)
  const targetPath = path.resolve(rootPath, safeFileName(fileName))

  if (!targetPath.startsWith(rootPath + path.sep)) {
    throw new BadRequestException('เส้นทางไฟล์ไม่ถูกต้อง')
  }

  return targetPath
}

// เก็บไฟล์ที่อัพโหลดไว้ในโฟลเดอร์ย่อยของตัวเอง ไม่ปนกับไฟล์ temp ของโปรแกรมอื่น
// เพราะ TMP_PATH มักถูกตั้งเป็น temp ของทั้งเครื่อง การไล่ลบตรงนั้นจะกระทบโปรแกรมอื่น
const UPLOAD_TEMP_FOLDER = 'kats_uploads'

export const getUploadTempDir = (): string => {
  const tempDir = path.join(process.env.TMP_PATH ?? '', UPLOAD_TEMP_FOLDER)

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  return tempDir
}

/**
 * ลบไฟล์ที่อัพโหลดค้างไว้แต่ไม่เคยถูกบันทึกลง record
 * ไล่ลบเฉพาะในโฟลเดอร์ของเราเท่านั้น
 */
export const cleanUpTempFiles = async (maxAgeMs: number): Promise<number> => {
  const tempDir = getUploadTempDir()
  const fileNames = await fs.readdir(tempDir)
  const expiredAt = Date.now() - maxAgeMs

  let deletedCount = 0

  for (const fileName of fileNames) {
    const filePath = path.join(tempDir, fileName)

    try {
      const fileStat = await fs.stat(filePath)

      if (fileStat.isFile() && fileStat.mtimeMs < expiredAt) {
        await fs.unlink(filePath)
        deletedCount += 1
      }
    } catch {
      // ไฟล์อาจถูกลบไปแล้วระหว่างวน ข้ามไปตัวถัดไป
    }
  }

  return deletedCount
}

/**
 * ย้ายไฟล์ที่อัพโหลดค้างไว้เข้าโฟลเดอร์ปลายทางของฟีเจอร์
 * คืนชื่อไฟล์ที่ผ่านการตรวจแล้ว เพื่อเอาไปเก็บลง database
 */
export const moveTempFileTo = async (
  dirname: string,
  fileName: string,
): Promise<string> => {
  const originPath = resolveWithin(getUploadTempDir(), fileName)
  const destinationPath = resolveWithin(dirname, fileName)

  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true })
  }

  await fs.copy(originPath, destinationPath, { overwrite: true })

  return safeFileName(fileName)
}

export const deleteFile = async (path: string): Promise<void> => {
  const isExists = await fs.pathExists(path)
  if (isExists) {
    await fs.unlink(path)
  }
}
