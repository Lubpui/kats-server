import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { SharedService } from './shared.service'
import { User, UserSchema } from 'src/users/schemas/user.schema'
import { MAIN_CONNECTION_NAME } from './constanrs'

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      MAIN_CONNECTION_NAME,
    ),
    ConfigModule,
  ],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {}
