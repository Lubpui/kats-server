import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Employee, EmployeeDocument } from './schemas/employee.schema'
import { Model } from 'mongoose'
import { EmployeeResquest } from './requests/employee.request'
import { EmployeeResponse } from './responses/employee.response'
import { modelMapper } from 'src/utils/mapper.util'

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name)
    private readonly EmployeeModel: Model<EmployeeDocument>,
  ) {}

  async createEmployee(
    createEmployeeResquest: EmployeeResquest,
  ): Promise<EmployeeResponse> {
    try {
      const createdEmployee = await new this.EmployeeModel().save()
      return modelMapper(EmployeeResponse, createdEmployee)
    } catch (error) {
      throw error
    }
  }

  findAll() {
    return `This action returns all employees`
  }
}
