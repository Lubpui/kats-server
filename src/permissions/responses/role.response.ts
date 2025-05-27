import { Expose, Type } from 'class-transformer'
import { PermissionResponse } from './permission.reponse'

export class RoleResponse {
  @Expose()
  _id: string

  @Expose()
  name: string

  @Expose()
  @Type(() => PermissionResponse)
  permissions: PermissionResponse

  @Expose()
  hasView: boolean

  @Expose()
  hasEdit: boolean

  @Expose()
  hasDelete: boolean
}

export class RoleListResponse {
  @Expose()
  @Type(() => RoleResponse)
  data: RoleResponse[]
}
