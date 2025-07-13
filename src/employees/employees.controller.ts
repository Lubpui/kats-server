import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { EmployeesService } from './employees.service'
import { EmployeeRequest } from './requests/employee.request'
import { EmployeeResponse } from './responses/employee.response'
import { QueryPagination } from 'src/shared/types/queryPagination'
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
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

  @Get('pagination')
  getAllEmployeePaginations(
    @Query() query: QueryPagination,
  ): Promise<EmployeeResponse[]> {
    return this.employeesService.getAllEmployeePaginations(query)
  }

  @Get(':employeeId')
  getEmployeeById(
    @Param('employeeId') employeeId: string,
  ): Promise<EmployeeResponse> {
    return this.employeesService.getEmployeeById(employeeId)
  }

  @Put(':employeeId')
  updateeBookingById(
    @Param('employeeId') bookingId: string,
    @Body() updateEmployeeRequest: EmployeeRequest,
  ) {
    return this.employeesService.updateEmployeeById(
      bookingId,
      updateEmployeeRequest,
    )
  }

  @Delete(':employeeId')
  deleteEmployeeById(@Param('employeeId') employeeId: string) {
    return this.employeesService.deleteEmployeeById(employeeId)
  }
}
