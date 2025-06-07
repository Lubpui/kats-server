import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { RoleLiteResponse, RoleResponse } from './responses/role.response'
import { RoleRequest } from './requests/role.request'

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post('inItialRole')
  createInitialRole(): Promise<RoleResponse> {
    return this.permissionsService.createInitialRole()
  }

  @Post('role')
  createRole(@Body() createRoleRequest: RoleRequest) {
    return this.permissionsService.createRole(createRoleRequest)
  }

  @Get('role')
  getAllRoles(@Query('delete') del: string): Promise<RoleLiteResponse[]> {
    return this.permissionsService.getAllRoles(Number(del))
  }

  @Get('role/authz')
  getAllRolesForPermission(): Promise<RoleResponse[]> {
    return this.permissionsService.getAllRolesForPermission()
  }

  @Get('role/:roleId')
  getRoleById(@Param('roleId') roleId: string): Promise<RoleResponse> {
    return this.permissionsService.getRoleById(roleId)
  }

  @Put('role/update/:roleId')
  updateRoleById(
    @Param('roleId') roleId: string,
    @Body() updateRoletRequest: RoleRequest,
  ) {
    return this.permissionsService.updateRoleById(roleId, updateRoletRequest)
  }

  @Post('role/selectDelete/:roleId')
  isDeleteRoleById(
    @Param('roleId') roleId: string,
    @Body() updateStatusDeleteRequest: RoleRequest,
  ) {
    return this.permissionsService.isDeleteRoleById(
      roleId,
      updateStatusDeleteRequest,
    )
  }

  @Delete('role/delete/:roleId')
  DeleteRoleById(@Param('roleId') roleId: string) {
    return this.permissionsService.DeleteRoleById(roleId)
  }
}
