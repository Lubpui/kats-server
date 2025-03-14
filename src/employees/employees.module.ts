import { Module } from '@nestjs/common'
import { EmployeesService } from './employees.service'
import { EmployeesController } from './employees.controller'

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesModule],
})
export class EmployeesModule {}
