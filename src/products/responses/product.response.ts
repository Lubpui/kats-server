import { Expose } from 'class-transformer'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { ProductType } from 'src/shared/enums/product.enum'

export class ProductCatagoryResponse {
  @Expose()
  @IsNotEmpty()
  name: string

  @Expose()
  @IsNotEmpty()
  code: string
}

export class ProductDetailResponse {
  @Expose()
  type: number

  @Expose()
  price: number
}

export class ProductResponse {
  @Expose()
  name: string

  @Expose()
  catagories: ProductCatagoryResponse

  @Expose()
  productDetails: ProductDetailResponse[]

  @Expose()
  @IsNotEmpty()
  @IsEnum(ProductType)
  productType: ProductType
}
