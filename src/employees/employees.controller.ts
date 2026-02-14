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
import { UserInfo } from 'src/shared/decorators/user-info.decorator'
import { UserResponse } from 'src/users/responses/user.response'

@UseGuards(JwtAuthGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  createEmployee(
    @UserInfo() userInfo: UserResponse,
    @Body() createEmployeeRequest: EmployeeRequest,
  ) {
    return this.employeesService.createEmployee(userInfo, createEmployeeRequest)
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
  updateEmployeeById(
    @UserInfo() userInfo: UserResponse,
    @Param('employeeId') employeeId: string,
    @Body() updateEmployeeRequest: EmployeeRequest,
  ) {
    return this.employeesService.updateEmployeeById(
      userInfo,
      employeeId,
      updateEmployeeRequest,
    )
  }

  @Post('selectDelete/:employeeId')
  isDeleteEmployeeById(
    @UserInfo() userInfo: UserResponse,
    @Param('employeeId') employeeId: string,
    @Body() updateStatusDeleteRequest: EmployeeRequest,
  ) {
    return this.employeesService.isDeleteEmployeeById(
      userInfo,
      employeeId,
      updateStatusDeleteRequest,
    )
  }

  @Delete(':employeeId')
  deleteEmployeeById(@Param('employeeId') employeeId: string) {
    return this.employeesService.deleteEmployeeById(employeeId)
  }
}
