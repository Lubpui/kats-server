import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Role, RoleDocument } from './schemas/role.schema'
import { RoleListResponse, RoleResponse } from './responses/role.response'
import { modelMapper } from 'src/utils/mapper.util'
import {
  mockUpPermissions,
  mockUpRoleList,
} from 'src/shared/mockUps/mockUp-Permission'
import { RoleRequest } from './requests/role.request'

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async createInitialRole(): Promise<RoleResponse> {
    try {
      const createdRole = await this.roleModel.insertMany(mockUpRoleList)

      return modelMapper(RoleResponse, createdRole)
    } catch (error) {
      throw error
    }
  }

  async createRole(createRoleRequest: RoleRequest): Promise<RoleResponse> {
    try {
      const createRole = {
        ...createRoleRequest,
        permissions: mockUpPermissions,
      }
      const role = await new this.roleModel(createRole).save()
      return modelMapper(RoleResponse, role)
    } catch (error) {
      throw error
    }
  }

  async getAllRoles(): Promise<RoleResponse[]> {
    try {
      const Roles = await this.roleModel.find()
      return modelMapper(RoleListResponse, { data: Roles }).data
    } catch (error) {
      throw error
    }
  }

  async getRoleById(roleId: string): Promise<RoleResponse> {
    const catagorie = await this.roleModel.findById(roleId)
    return modelMapper(RoleResponse, catagorie)
  }

  async updateRoleById(roleId: string, updateRoleRequest: RoleRequest) {
    const role = await this.roleModel.findByIdAndUpdate(roleId, {
      $set: { ...updateRoleRequest },
    })
    return role
  }

  async isDeleteRoleById(
    roleId: string,
    updateStatusDeleteRequest: RoleRequest,
  ) {
    const updateStatus = await this.updateRoleById(
      roleId,
      updateStatusDeleteRequest,
    )

    return updateStatus
  }
}
