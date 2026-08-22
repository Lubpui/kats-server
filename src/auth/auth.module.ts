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
import { loadJwtKeys } from 'src/utils/jwt-keys.util'

const AuthJwt = JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    ...loadJwtKeys(configService),
    signOptions: {
      issuer: configService.get('JWT_ISSUER'),
      expiresIn: configService.get('JWT_EXPIRES'),
      algorithm: configService.get('JWT_ALGORITHM'),
    },
  }),
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
