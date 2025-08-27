import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! Ham'
  }

  getENV() {
    return {
      MONGO_URI_DEMO: process.env.MONGO_URI_DEMO,
      MONGO_URI: process.env.MONGO_URI,
      JWT_ISSUER: process.env.JWT_ISSUER,
      JWT_EXPIRES: process.env.JWT_EXPIRES,
      JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
      JWT_ALGORITHM: process.env.JWT_ALGORITHM,
      UPLOAD_PATH: process.env.UPLOAD_PATH,
      TMP_PATH: process.env.TMP_PATH,
      JWT_SIGN_PRIVATE_KEY: process.env.JWT_SIGN_PRIVATE_KEY,
      JWT_SIGN_PUBLIC_KEY: process.env.JWT_SIGN_PUBLIC_KEY,
    }
  }
}
