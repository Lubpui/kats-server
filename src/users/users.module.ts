import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { User, UserSchema } from './schemas/user.schema'
import { MongooseModule } from '@nestjs/mongoose'

const UserMongooseModuleList = [
  MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
]

@Module({
  imports: [...UserMongooseModuleList],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
