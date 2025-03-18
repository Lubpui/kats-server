import { Controller, Get, Post, Body } from '@nestjs/common'
import { EmployeesService } from './employees.service'

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(@Body() createEmployeeDto: any) {
    return this.employeesService.create(createEmployeeDto)
  }

  @Get()
  findAll() {
    return this.employeesService.findAll()
  }
}
