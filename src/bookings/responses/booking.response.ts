import { Expose, Type } from 'class-transformer'
import { IsEnum } from 'class-validator'
import {
  ProductDetailResponse,
  ProductSnapshotResponse,
} from 'src/products/responses/product.response'
import { BookingStatus } from 'src/shared/enums/booking-status.enum'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'
import {
  GuaranteePreviewResponse,
  GuaranteeResponse,
} from './guarantee.response'

export class BookingResponse {
  @Expose()
  _id: string

  @Expose()
  codeId: number

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
  province: string

  @Expose()
  @IsEnum(BookingStatus)
  status: BookingStatus

  @Expose()
  @Type(() => ProductSnapshotResponse)
  product: ProductSnapshotResponse

  @Expose()
  @Type(() => GuaranteeResponse)
  guarantees: GuaranteeResponse[]

  @Expose()
  productId: string

  @Expose()
  price: ProductDetailResponse

  @Expose()
  tel: string

  @Expose()
  image: string

  @Expose()
  slip: string

  @Expose()
  @IsEnum(DeleteStatus)
  delete: DeleteStatus
}

export class BookingListResponse {
  @Expose()
  @Type(() => BookingResponse)
  data: BookingResponse[]
}

/**
 * ข้อมูลสำหรับหน้าจองสาธารณะ (/bookings/preview) ที่เรียกได้โดยไม่ต้องมี token
 * เปิดเฉพาะที่ปฏิทินหน้าเว็บใช้จริง — ไม่มีชื่อ เบอร์ ทะเบียน ราคา หรือสลิปของลูกค้า
 */
export class BookingPreviewResponse {
  @Expose()
  bookDate: string

  @Expose()
  bookTime: string

  @Expose()
  carType: string

  @Expose()
  carModel: string

  @Expose()
  @IsEnum(BookingStatus)
  status: BookingStatus

  @Expose()
  @Type(() => GuaranteePreviewResponse)
  guarantees: GuaranteePreviewResponse[]
}

export class BookingPreviewListResponse {
  @Expose()
  @Type(() => BookingPreviewResponse)
  data: BookingPreviewResponse[]
}
