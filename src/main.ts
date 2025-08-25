import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  const configService = app.get(ConfigService)

  app.enableCors({
    origin: [
      'https://gunprotections.com',
      'https://www.gunprotections.com',
      'http://localhost:3000',
      'http://localhost:5173',
    ],
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
