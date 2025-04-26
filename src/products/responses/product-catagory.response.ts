import { Expose, Type } from 'class-transformer'
import { IsEnum } from 'class-validator'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'

export class ProductCatagoryResponse {
  @Expose()
  _id: string

  @Expose()
  name: string

  @Expose()
  code: string

  @Expose()
  @IsEnum(DeleteStatus)
  delete: DeleteStatus
}

export class ProductCatagoryListResponse {
  @Expose()
  @Type(() => ProductCatagoryResponse)
  data: ProductCatagoryResponse[]
}
