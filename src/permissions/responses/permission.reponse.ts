import { Expose, Type } from 'class-transformer'
import { IsEnum } from 'class-validator'
import { PermissionKey } from 'src/shared/enums/permission-enum'

export class PermissionResponse {
  @Expose()
  _id: string

  @Expose()
  name: string

  @Expose()
  @IsEnum(PermissionKey)
  key: PermissionKey

  @Expose()
  hasView: boolean

  @Expose()
  hasEdit: boolean

  @Expose()
  hasDelete: boolean
}

export class PermissionListResponse {
  @Expose()
  @Type(() => PermissionResponse)
  data: PermissionResponse[]
}
