import { IsEnum, IsNotEmpty } from 'class-validator'
import { PermissionKey } from 'src/shared/enums/permission-enum'
import { Permission } from '../schemas/permission.schema'

export class RoleRequest {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  permissions: Permission[]

  @IsNotEmpty()
  @IsEnum(PermissionKey)
  type: PermissionKey
}
