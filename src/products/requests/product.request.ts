import { IsEnum, IsNotEmpty } from 'class-validator'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'
import { ProductType } from 'src/shared/enums/product.enum'

export class ProductDetailRequest {
  @IsNotEmpty()
  type: number

  @IsNotEmpty()
  amount: number
}

export class ProductRequest {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  catagoryId: string

  @IsNotEmpty()
  productDetails: ProductDetailRequest[]

  @IsNotEmpty()
  @IsEnum(ProductType)
  productType: ProductType

  @IsNotEmpty()
  @IsEnum(DeleteStatus)
  delete: DeleteStatus
}

export class CreateProductRequest extends ProductRequest {}
