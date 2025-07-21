import { Injectable, NotFoundException } from '@nestjs/common'
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
import { CUSTOM_CONNECTION_NAME } from 'src/utils/constanrs'

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Role.name, CUSTOM_CONNECTION_NAME)
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
      
      const sortedRoles = filterdRoles.sort((a, b) => {
        if (a.type === 'CEO') return -1
        if (b.type === 'CEO') return 1

        if (a.type === 'ADMIN') return -1
        if (b.type === 'ADMIN') return 1

        if (a.type === 'ACCOUNT') return -1
        if (b.type === 'ACCOUNT') return 1
        return 0
      })

      return sortedRoles
    } catch (error) {
      throw error
    }
  }

  async getAllRolesForPermission(): Promise<RoleResponse[]> {
    try {
      const roles = await this.roleModel.find()
      if (!roles || roles.length === 0) {
        throw new NotFoundException('No roles found')
      }

      const sortedRoles = roles.sort((a, b) => {
        if (a.type === 'CEO') return -1
        if (b.type === 'CEO') return 1

        if (a.type === 'ADMIN') return -1
        if (b.type === 'ADMIN') return 1

        if (a.type === 'ACCOUNT') return -1
        if (b.type === 'ACCOUNT') return 1
        return 0
      })

      return modelMapper(RoleListResponse, { data: sortedRoles }).data
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
