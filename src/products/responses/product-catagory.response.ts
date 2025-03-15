import { Expose, Type } from 'class-transformer'

export class ProductCatagoryResponse {
  @Expose()
  _id: string

  @Expose()
  name: string

  @Expose()
  code: string
}

export class ProductCatagoryListResponse {
  @Expose()
  @Type(() => ProductCatagoryResponse)
  data: ProductCatagoryResponse[]
}
