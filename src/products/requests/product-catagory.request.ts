import { IsEnum, IsNotEmpty } from 'class-validator'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'

export class ProductCatagoryRequest {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  code: string

  @IsNotEmpty()
  @IsEnum(DeleteStatus)
  delete: DeleteStatus
}
