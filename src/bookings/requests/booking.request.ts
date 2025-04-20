import { IsNotEmpty, IsOptional } from 'class-validator'
import { ProductDetailResponse } from 'src/products/responses/product.response'
import { BookingStatus } from 'src/shared/enums/booking-status.enum'
import { GuaranteeResponse } from '../responses/booking.response'

export class BookingRequest {
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

  @IsNotEmpty()
  productId: string

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
}
