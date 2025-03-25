import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Employee, EmployeeDocument } from './schemas/employee.schema'
import { Model } from 'mongoose'
import { EmployeeRequest } from './requests/employee.request'
import {
  EmployeeListResponse,
  EmployeeResponse,
} from './responses/employee.response'
import { modelMapper } from 'src/utils/mapper.util'

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name)
    private readonly EmployeeModel: Model<EmployeeDocument>,
  ) {}

  async createEmployee(
    createEmployeeResquest: EmployeeRequest,
  ): Promise<EmployeeResponse> {
    try {
      const createdEmployee = await new this.EmployeeModel(
        createEmployeeResquest,
      ).save()
      return modelMapper(EmployeeResponse, createdEmployee)
    } catch (error) {
      throw error
    }
  }

  async getAllEmployees(): Promise<EmployeeResponse[]> {
    const employees = await this.EmployeeModel.find()
    return modelMapper(EmployeeListResponse, { data: employees }).data
  }

  async getEmployeeById(employeeId: string): Promise<EmployeeResponse> {
    try {
      const bookingRes = await this.EmployeeModel.findById(employeeId)

      return modelMapper(EmployeeResponse, bookingRes)
    } catch (error) {
      throw error
    }
  }

  async updateEmployeeById(
    employeeId: string,
    updateEmployeeRequest: EmployeeResponse,
  ) {
    const employee = await this.EmployeeModel.findByIdAndUpdate(employeeId, {
      $set: { ...updateEmployeeRequest },
    })
    return employee
  }

  async deleteEmployeeById(employeeId: string) {
    const employee = await this.EmployeeModel.findByIdAndDelete(employeeId)
    return employee
  }
}
