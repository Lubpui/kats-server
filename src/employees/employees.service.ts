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
import { QueryPagination } from 'src/shared/types/queryPagination'

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

  async getAllEmployeePaginations(
    query: QueryPagination,
  ): Promise<EmployeeResponse[]> {
    try {
      const { term } = query

      console.log(0)

      const employeeRes = await this.EmployeeModel.aggregate([
        {
          $match: {
            $or: [
              { name: { $regex: term, $options: 'i' } },
              { tel: { $regex: term, $options: 'i' } },
            ],
          },
        },
      ])

      console.log(1)

      const employees = modelMapper(EmployeeListResponse, {
        data: employeeRes,
      }).data
      console.log(2)

      return employees
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async getEmployeeById(employeeId: string): Promise<EmployeeResponse> {
    try {
      const employeeRes = await this.EmployeeModel.findById(employeeId)

      return modelMapper(EmployeeResponse, employeeRes)
    } catch (error) {
      throw error
    }
  }

  async updateEmployeeById(
    employeeId: string,
    updateEmployeeRequest: EmployeeRequest,
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
