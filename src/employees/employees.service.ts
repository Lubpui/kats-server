import { Injectable, NotFoundException } from '@nestjs/common'
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
import { Role, RoleDocument } from 'src/permissions/schemas/role.schema'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'
import { CUSTOM_CONNECTION_NAME } from 'src/utils/constanrs'
import { UserResponse } from 'src/users/responses/user.response'
import * as fs from 'fs-extra'
import path from 'path'
import { deleteFile } from 'src/utils/common.util'

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name, CUSTOM_CONNECTION_NAME)
    private readonly EmployeeModel: Model<EmployeeDocument>,
    @InjectModel(Role.name, CUSTOM_CONNECTION_NAME)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async createEmployee(
    userInfo: UserResponse,
    createEmployeeResquest: EmployeeRequest,
  ): Promise<EmployeeResponse> {
    try {
      const { dbname } = userInfo
      const { image } = createEmployeeResquest

      if (image) {
        const dirname = path.join(
          process.env.UPLOAD_PATH ?? '',
          dbname,
          'profile',
        )
        const originPath = path.join(process.env.TMP_PATH ?? '', image)
        const destinationPath = path.join(dirname, image)
        if (!fs.existsSync(dirname)) {
          fs.mkdirSync(dirname, { recursive: true })
        }
        await fs.copy(originPath, destinationPath, { overwrite: true })
      }

      const createdEmployee = await new this.EmployeeModel({
        ...createEmployeeResquest,
        delete: DeleteStatus.ISNOTDELETE,
      }).save()
      return modelMapper(EmployeeResponse, createdEmployee)
    } catch (error) {
      throw error
    }
  }

  async getAllEmployees(): Promise<EmployeeResponse[]> {
    try {
      const employees = await this.EmployeeModel.find().populate({
        path: 'employmentInfo.role',
        model: this.roleModel,
        options: { strictPopulate: false },
      })

      return modelMapper(EmployeeListResponse, { data: employees }).data
    } catch (error) {
      console.log('getAllEmployees error:', error)

      throw error
    }
  }

  async getAllEmployeePaginations(
    query: QueryPagination,
  ): Promise<EmployeeResponse[]> {
    try {
      const { term } = query

      const employeeRes = await this.EmployeeModel.aggregate([
        {
          $match: {
            $or: [
              { name: { $regex: term, $options: 'i' } },
              { tel: { $regex: term, $options: 'i' } },
            ],
          },
        },
        {
          $lookup: {
            from: this.roleModel.collection.name,
            localField: 'employmentInfo.roleId',
            foreignField: '_id',
            as: 'employmentInfo.role',
            pipeline: [
              {
                $project: {
                  permissions: 0,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: '$employmentInfo.role',
            preserveNullAndEmptyArrays: true,
          },
        },
      ])

      const employees = modelMapper(EmployeeListResponse, {
        data: employeeRes,
      }).data

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
    userInfo: UserResponse,
    employeeId: string,
    updateEmployeeRequest: EmployeeRequest,
  ) {
    const { dbname } = userInfo
    const { image: newImage } = updateEmployeeRequest

    const employee = await this.EmployeeModel.findById(employeeId, {
      image: 1,
    })
    if (!employee) throw new NotFoundException('ไม่พบ employee')

    const { image: oldImage } = employee

    const dirname = path.join(process.env.UPLOAD_PATH ?? '', dbname, 'profile')

    if (newImage !== oldImage) {
      //ลบไฟล์เดิม
      if (oldImage && fs.existsSync(path.join(dirname, oldImage))) {
        await deleteFile(path.join(dirname, oldImage))
      }

      //สร้างไฟล์
      if (newImage) {
        const originPath = path.join(process.env.TMP_PATH ?? '', newImage)
        const destinationPath = path.join(dirname, newImage)
        if (!fs.existsSync(dirname)) {
          fs.mkdirSync(dirname, { recursive: true })
        }
        await fs.copy(originPath, destinationPath, { overwrite: true })
        updateEmployeeRequest.image = newImage
      }
    }

    const employeeRes = await this.EmployeeModel.findByIdAndUpdate(employeeId, {
      $set: { ...updateEmployeeRequest },
    })
    return employeeRes
  }

  async isDeleteEmployeeById(
    userInfo: UserResponse,
    employeeId: string,
    updateStatusDeleteRequest: EmployeeRequest,
  ) {
    const updateStatus = await this.updateEmployeeById(
      userInfo,
      employeeId,
      updateStatusDeleteRequest,
    )

    return updateStatus
  }

  async deleteEmployeeById(employeeId: string) {
    const employee = await this.EmployeeModel.findByIdAndDelete(employeeId)
    return employee
  }
}
