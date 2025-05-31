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
import { mockUpRoleList } from 'src/shared/mockUps/mockUp-Permission'

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

  // async createRole(): Promise<RoleResponse> {
  //   try {
  //     const createdRole = await new this.insertMany(mockUpRoleList)

  //     return modelMapper(RoleResponse, createdRole)
  //   } catch (error) {
  //     throw error
  //   }
  // }
}
