import { Expose, Type } from 'class-transformer'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { ProductType } from 'src/shared/enums/product.enum'
import { ProductCatagoryResponse } from './product-catagory.response'

export class ProductDetailResponse {
  @Expose()
  _id: string

  @Expose()
  type: number

  @Expose()
  price: number
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
  catagory: ProductCatagoryResponse

  @Expose()
  productDetails: ProductDetailResponse[]

  @Expose()
  @IsNotEmpty()
  @IsEnum(ProductType)
  productType: ProductType
}

export class ProductListResponse {
  @Expose()
  @Type(() => ProductResponse)
  data: ProductResponse[]
}
