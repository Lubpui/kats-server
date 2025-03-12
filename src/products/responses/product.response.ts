import { IsEnum, IsNotEmpty } from 'class-validator'
import { ProductType } from 'src/shared/enums/product.enum'

export class ProductCatagoryResponse {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  code: string
}

export class ProductDetailResponse {
  @IsNotEmpty()
  type: number

  @IsNotEmpty()
  price: number
}

export class ProductResponse {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  catagories: ProductCatagoryResponse

  @IsNotEmpty()
  productDetails: ProductDetailResponse[]

  @IsNotEmpty()
  @IsEnum(ProductType)
  productType: ProductType
}
