import { IsNotEmpty } from 'class-validator'
import { Permission } from '../schemas/permission.schema'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'

export class RoleRequest {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  permissions: Permission[]

  @IsNotEmpty()
  type: string

  @IsNotEmpty()
  delete: DeleteStatus
}
