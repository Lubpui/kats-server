import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtStrategy } from './jwt.strategy'
import { SharedModule } from 'src/utils/shared.modul'
import { User, UserSchema } from 'src/users/schemas/user.schema'
import { MAIN_CONNECTION_NAME } from 'src/utils/constanrs'
import { UsersModule } from 'src/users/users.module'
import fs from 'fs'

const AuthJwt = JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    // หากมี path ให้โหลดจากไฟล์
    const privPath = configService.get<string>('JWT_SIGN_PRIVATE_KEY_PATH')
    const pubPath = configService.get<string>('JWT_SIGN_PUBLIC_KEY_PATH')

    let privateKey = ''
    let publicKey = ''

    if (privPath) {
      try {
        privateKey = fs.readFileSync(privPath, 'utf8')
      } catch (err) {
        console.error('Failed reading private key file:', privPath, err)
        throw err
      }
    } else {
      // fallback: support one-line env with \n
      const raw = String(configService.get('JWT_SIGN_PRIVATE_KEY') || '')
      privateKey = raw.replace(/\\n/g, '\n')
    }

    if (pubPath) {
      try {
        publicKey = fs.readFileSync(pubPath, 'utf8')
      } catch (err) {
        console.error('Failed reading public key file:', pubPath, err)
        throw err
      }
    } else {
      const rawPub = String(configService.get('JWT_SIGN_PUBLIC_KEY') || '')
      publicKey = rawPub.replace(/\\n/g, '\n')
    }

    console.error('JwtModule using keys lengths:', {
      privateKeyLen: privateKey.length,
      publicKeyLen: publicKey.length,
    })

    return {
      privateKey,
      publicKey,
      signOptions: {
        issuer: configService.get('JWT_ISSUER'),
        expiresIn: configService.get('JWT_EXPIRES'),
        algorithm: configService.get('JWT_ALGORITHM'),
      },
    }
  },
  inject: [ConfigService],
})

const AuthMongoose = MongooseModule.forFeature(
  [{ name: User.name, schema: UserSchema }],
  MAIN_CONNECTION_NAME,
)

@Module({
  imports: [AuthJwt, AuthMongoose, SharedModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
