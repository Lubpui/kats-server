import { IsEnum, IsNotEmpty } from 'class-validator'
import { PermissionKey } from 'src/shared/enums/permission-enum'

export class PermissionRequest {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  @IsEnum(PermissionKey)
  key: PermissionKey

  @IsNotEmpty()
  hasView: boolean

  @IsNotEmpty()
  hasEdit: boolean

  @IsNotEmpty()
  hasDelete: boolean
}
