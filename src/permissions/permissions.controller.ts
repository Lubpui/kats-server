import { Body, Controller, Post } from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { RoleResponse } from './responses/role.response'
import { RoleRequest } from './requests/role.request'
import { PermissionResponse } from './responses/permission.reponse'
import { PermissionRequest } from './requests/permission.request'

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  createPermission(
    @Body() createPermissionRequest: PermissionRequest,
  ): Promise<PermissionResponse> {
    return this.permissionsService.createPermission(createPermissionRequest)
  }

  // @Post('role')
  // createRole(): Promise<RoleResponse> {
  //   return this.permissionsService.createRole()
  // }
}
