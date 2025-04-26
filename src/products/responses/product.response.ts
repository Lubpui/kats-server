import { Expose, Type } from 'class-transformer'
import { IsEnum } from 'class-validator'
import { ProductType } from 'src/shared/enums/product.enum'
import { ProductCatagoryResponse } from './product-catagory.response'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'

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
  @IsEnum(ProductType)
  productType: ProductType

  @Expose()
  @IsEnum(DeleteStatus)
  delete: DeleteStatus
}

export class ProductListResponse {
  @Expose()
  @Type(() => ProductResponse)
  data: ProductResponse[]
}
