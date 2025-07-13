import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { User, UserSchema } from './schemas/user.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { PermissionsModule } from 'src/permissions/permissions.module'
import { Employee, EmployeeSchema } from 'src/employees/schemas/employee.schema'
import {
  CUSTOM_CONNECTION_NAME,
  MAIN_CONNECTION_NAME,
} from 'src/utils/constanrs'
import { DocumentCount, DocumentCountSchema } from 'src/document-count/schemas/document-count.schema'

export const UserCustomMongoose = MongooseModule.forFeature(
  [
    { name: Employee.name, schema: EmployeeSchema },
    { name: DocumentCount.name, schema: DocumentCountSchema },
  ],
  CUSTOM_CONNECTION_NAME,
)

export const UserMainMongoose = MongooseModule.forFeature(
  [{ name: User.name, schema: UserSchema }],
  MAIN_CONNECTION_NAME,
)

@Module({
  imports: [UserCustomMongoose, UserMainMongoose, PermissionsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
