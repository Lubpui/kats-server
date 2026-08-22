import { ConfigService } from '@nestjs/config'
import fs from 'fs'

/**
 * อ่านกุญแจจากไฟล์ถ้าตั้ง <ENV>_PATH ไว้ ไม่งั้น fallback ไปอ่านจาก env ที่ escape \n มา
 * ถ้าอ่านไฟล์ไม่ได้ก็ยังลอง env ต่อ ดีกว่าปล่อยให้ทั้งระบบบูตไม่ขึ้น
 */
const readKey = (configService: ConfigService, envName: string): string => {
  const filePath = configService.get<string>(`${envName}_PATH`)

  if (filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8')
    } catch {
      // ตกลงไปใช้ค่าจาก env แทน
    }
  }

  const key = String(configService.get(envName) || '').replace(/\\n/g, '\n')

  if (!key) {
    throw new Error(
      `ไม่พบ JWT key: ต้องตั้ง ${envName}_PATH หรือ ${envName} ใน env`,
    )
  }

  return key
}

export const loadJwtPublicKey = (configService: ConfigService): string =>
  readKey(configService, 'JWT_SIGN_PUBLIC_KEY')

/**
 * โหลดคู่กุญแจ RS256 — ใช้ร่วมกันทั้ง app.module, auth.module และ jwt.strategy
 * ถ้าจะเปลี่ยนวิธีเก็บกุญแจ แก้ที่นี่ที่เดียว
 */
export const loadJwtKeys = (configService: ConfigService) => ({
  privateKey: readKey(configService, 'JWT_SIGN_PRIVATE_KEY'),
  publicKey: loadJwtPublicKey(configService),
})
