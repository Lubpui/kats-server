import { Module } from '@nestjs/common'
import { EmployeesService } from './employees.service'
import { EmployeesController } from './employees.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Employee, EmployeeSchema } from './schemas/employee.schema'
import { Role, RoleSchema } from 'src/permissions/schemas/role.schema'
import { CUSTOM_CONNECTION_NAME } from 'src/utils/constanrs'
import { ConfigModule } from '@nestjs/config'

export const EmployeesMongoose = MongooseModule.forFeature(
  [
    { name: Employee.name, schema: EmployeeSchema },
    { name: Role.name, schema: RoleSchema },
  ],
  CUSTOM_CONNECTION_NAME,
)
@Module({
  imports: [EmployeesMongoose, ConfigModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
