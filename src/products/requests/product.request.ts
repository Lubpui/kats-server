import { IsEnum, IsNotEmpty } from 'class-validator'
import { ProductType } from 'src/shared/enums/product.enum'
import { ProductCatagoryRequest } from './product-catagory.request'

export class ProductDetailRequest {
  @IsNotEmpty()
  type: number

  @IsNotEmpty()
  price: number
}

export class ProductRequest {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  catagory: ProductCatagoryRequest

  @IsNotEmpty()
  productDetails: ProductDetailRequest[]

  @IsNotEmpty()
  @IsEnum(ProductType)
  productType: ProductType
}

export class CreateProductRequest extends ProductRequest {}
