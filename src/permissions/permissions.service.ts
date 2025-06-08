import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Role, RoleDocument } from './schemas/role.schema'
import {
  RoleListResponse,
  RoleLiteListResponse,
  RoleLiteResponse,
  RoleResponse,
} from './responses/role.response'
import { modelMapper } from 'src/utils/mapper.util'
import {
  mockUpPermissions,
  mockUpRoleList,
} from 'src/shared/mockUps/mockUp-Permission'
import { RoleRequest } from './requests/role.request'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async createInitialRole(
    _roleModel?: Model<RoleDocument>,
  ): Promise<RoleResponse> {
    try {
      const roleModel = _roleModel || this.roleModel
      await roleModel.insertMany(mockUpRoleList)

      const ownerRole = await roleModel.findOne({ type: 'CEO' })
      return modelMapper(RoleResponse, ownerRole)
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

  async getAllRoles(del: number): Promise<RoleLiteResponse[]> {
    try {
      const roleRes = await this.roleModel.find({}, { permissions: 0 })
      const roles = modelMapper(RoleLiteListResponse, { data: roleRes }).data

      const filterdRoles = roles.filter(
        (role) => role.delete === (del as DeleteStatus),
      )

      return filterdRoles
    } catch (error) {
      throw error
    }
  }

  async getAllRolesForPermission(): Promise<RoleResponse[]> {
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

  async DeleteRoleById(roleId: string) {
    const role = await this.roleModel.findByIdAndDelete(roleId)
    return role
  }
}
