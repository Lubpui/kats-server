import { Module } from '@nestjs/common'
import { EmployeesService } from './employees.service'
import { EmployeesController } from './employees.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Employee, EmployeeSchema } from './schemas/employee.schema'
import { Role, RoleSchema } from 'src/permissions/schemas/role.schema'

export const EmployeesMongoose = MongooseModule.forFeature([
  { name: Employee.name, schema: EmployeeSchema },
  { name: Role.name, schema: RoleSchema },
])
@Module({
  imports: [EmployeesMongoose],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
