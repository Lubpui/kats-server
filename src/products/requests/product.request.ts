import { IsEnum, IsNotEmpty } from 'class-validator'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'

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
  typeProductId: string

  @IsNotEmpty()
  @IsEnum(DeleteStatus)
  delete: DeleteStatus
}
