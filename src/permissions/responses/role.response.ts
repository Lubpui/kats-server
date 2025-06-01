import { Expose, Type } from 'class-transformer'
import { PermissionResponse } from './permission.reponse'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'

export class RoleResponse {
  @Expose()
  _id: string

  @Expose()
  name: string

  @Expose()
  @Type(() => PermissionResponse)
  permissions: PermissionResponse

  @Expose()
  type: string

  @Expose()
  delete: DeleteStatus
}

export class RoleListResponse {
  @Expose()
  @Type(() => RoleResponse)
  data: RoleResponse[]
}
