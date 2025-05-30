import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Role, RoleDocument } from './schemas/role.schema'
import { Permission, PermissionDocument } from './schemas/permission.schema'
import { RoleRequest } from './requests/role.request'
import { RoleResponse } from './responses/role.response'
import { modelMapper } from 'src/utils/mapper.util'
import { PermissionRequest } from './requests/permission.request'
import { PermissionResponse } from './responses/permission.reponse'

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<PermissionDocument>,
  ) {}

  async createPermission(
    createPermissionRequest: PermissionRequest,
  ): Promise<PermissionResponse> {
    try {
      const newPermission = {
        ...createPermissionRequest,
      }

      const createdPermission = await new this.permissionModel(
        newPermission,
      ).save()

      return modelMapper(PermissionResponse, createdPermission)
    } catch (error) {
      throw error
    }
  }

  async createRole(createRoleRequest: RoleRequest): Promise<RoleResponse> {
    try {
      const newRole = {
        ...createRoleRequest,
      }

      const createdRole = await new this.roleModel(newRole).save()

      return modelMapper(RoleResponse, createdRole)
    } catch (error) {
      throw error
    }
  }
}
