import { IsEnum, IsNotEmpty } from 'class-validator'
import { ProductType } from 'src/shared/enums/product.enum'
import { ProductCatagoryResquest } from './product-catagory.request'

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
  catagory: ProductCatagoryResquest

  @IsNotEmpty()
  productDetails: ProductDetailResquest[]

  @IsNotEmpty()
  @IsEnum(ProductType)
  productType: ProductType
}

export class CreateProductResquest extends ProductResquest {}
