import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'

const DEFAULT_CORS_ORIGINS = [
  'https://rustprotections.com',
  'https://www.rustprotections.com',
  'http://localhost:3000',
  'http://localhost:5173',
]

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  const configService = app.get(ConfigService)

  // ตั้ง CORS_ORIGINS ใน env คั่นด้วย , เพื่อเพิ่มโดเมนโดยไม่ต้องแก้โค้ด
  const corsOrigins = (configService.get<string>('CORS_ORIGINS') ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  app.enableCors({
    origin: corsOrigins.length ? corsOrigins : DEFAULT_CORS_ORIGINS,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, Accept, X-Requested-With',
    credentials: true,
    maxAge: 86400,
  })

  const uploadPath = configService.get<string>('UPLOAD_PATH')
  if (uploadPath) {
    app.useStaticAssets(uploadPath)
  } else {
    throw new Error('UPLOAD_PATH is not defined in configuration')
  }
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
