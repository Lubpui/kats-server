import { Expose, Type } from 'class-transformer'
import { IsEnum } from 'class-validator'
import {
  ProductDetailResponse,
  ProductResponse,
} from 'src/products/responses/product.response'
import { BookingStatus } from 'src/shared/enums/booking-status.enum'

export class BookingResponse {
  @Expose()
  _id: string

  @Expose()
  number: string

  @Expose()
  receiptBookNo: string

  @Expose()
  bookDate: string

  @Expose()
  bookTime: string

  @Expose()
  name: string

  @Expose()
  carType: string

  @Expose()
  carModel: string

  @Expose()
  licensePlate: string

  @Expose()
  @IsEnum(BookingStatus)
  status: BookingStatus

  @Expose()
  @Type(() => ProductResponse)
  product: ProductResponse

  @Expose()
  price: ProductDetailResponse

  @Expose()
  tel: string

  @Expose()
  image: string

  @Expose()
  slip: string
}

export class BookingListResponse {
  @Expose()
  @Type(() => BookingResponse)
  data: BookingResponse[]
}
