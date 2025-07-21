import { IsNotEmpty, IsOptional } from 'class-validator'
import { ProductDetailResponse, ProductSnapshotResponse } from 'src/products/responses/product.response'
import { BookingStatus } from 'src/shared/enums/booking-status.enum'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'
import { GuaranteeResponse } from '../responses/guarantee.response'

export class BookingRequest {
  @IsNotEmpty()
  codeId: number

  @IsNotEmpty()
  number: string

  @IsNotEmpty()
  receiptBookNo: string

  @IsNotEmpty()
  bookDate: string

  @IsNotEmpty()
  bookTime: string

  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  carType: string

  @IsNotEmpty()
  carModel: string

  @IsNotEmpty()
  licensePlate: string

  @IsNotEmpty()
  province: string

  @IsNotEmpty()
  status: BookingStatus

  @IsOptional()
  product?: ProductSnapshotResponse

  @IsOptional()
  productId?: string

  @IsNotEmpty()
  price: ProductDetailResponse

  @IsOptional()
  guarantees?: GuaranteeResponse[]

  @IsNotEmpty()
  tel: string

  @IsOptional()
  image?: string

  @IsOptional()
  slip?: string

  @IsNotEmpty()
  delete: DeleteStatus
}
