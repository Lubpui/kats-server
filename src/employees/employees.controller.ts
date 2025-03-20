import { Controller, Get, Post, Body } from '@nestjs/common'
import { EmployeesService } from './employees.service'
import { EmployeeRequest } from './requests/employee.request'
import { EmployeeResponse } from './responses/employee.response'

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  createEmployee(@Body() createEmployeeRequest: EmployeeRequest) {
    return this.employeesService.createEmployee(createEmployeeRequest)
  }

  @Get()
  getAllEmployees(): Promise<EmployeeResponse[]> {
    return this.employeesService.getAllEmployees()
  }
}
