import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  app.enableCors()
  const configService = app.get(ConfigService)

  const uploadPath = configService.get<string>('UPLOAD_PATH')
  if (uploadPath) {
    app.useStaticAssets(uploadPath)
  } else {
    throw new Error('UPLOAD_PATH is not defined in configuration')
  }
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
