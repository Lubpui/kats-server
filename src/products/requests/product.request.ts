import { IsEnum, IsNotEmpty } from 'class-validator'
import { ProductType } from 'src/shared/enums/product.enum'

export class ProductCatagoryResquest {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  code: string
}

export class ProductDetailResquest {
  @IsNotEmpty()
  type: number

  @IsNotEmpty()
  price: number
}

export class ProductResquest {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  catagories: ProductCatagoryResquest

  @IsNotEmpty()
  productDetails: ProductDetailResquest[]

  @IsNotEmpty()
  @IsEnum(ProductType)
  productType: ProductType
}

export class CreateProductResquest extends ProductResquest {}
