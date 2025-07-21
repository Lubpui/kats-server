import { Expose, Type } from 'class-transformer'
import { IsEnum } from 'class-validator'
import { ProductCatagoryResponse } from './product-catagory.response'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'
import { TypeProductResponse } from './product-typeproduct.response'

export class ProductDetailResponse {
  @Expose()
  _id: string

  @Expose()
  type: number

  @Expose()
  amount: number
}

export class ProductDetailListResponse {
  @Expose()
  @Type(() => ProductDetailResponse)
  data: ProductDetailResponse[]
}

export class ProductResponse {
  @Expose()
  _id: string

  @Expose()
  name: string

  @Expose()
  @Type(() => ProductCatagoryResponse)
  catagory: ProductCatagoryResponse

  @Expose()
  catagoryId: string

  @Expose()
  productDetails: ProductDetailResponse[]

  @Expose()
  typeProductId: string

  @Expose()
  @Type(() => TypeProductResponse)
  typeProduct: TypeProductResponse

  @Expose()
  @IsEnum(DeleteStatus)
  delete: DeleteStatus
}

export class ProductListResponse {
  @Expose()
  @Type(() => ProductResponse)
  data: ProductResponse[]
}

export class ProductSnapshotResponse extends ProductResponse {
  @Expose()
  @Type(() => ProductCatagoryResponse)
  catagorySnapshot: ProductCatagoryResponse

  @Expose()
  @Type(() => TypeProductResponse)
  typeProductSnapshot: TypeProductResponse
}
