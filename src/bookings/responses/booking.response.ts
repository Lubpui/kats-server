import { Expose, Type } from 'class-transformer'
import { IsEnum } from 'class-validator'
import {
  ProductDetailResponse,
  ProductResponse,
} from 'src/products/responses/product.response'
import { BookingStatus } from 'src/shared/enums/booking-status.enum'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'

export class GuaranteeResponse {
  @Expose()
  serviceNo: number // ครั้งที่

  @Expose()
  serviceDate: string // วันที่เข้ารับบริการ

  @Expose()
  status: BookingStatus // วันที่เข้ารับบริการ

  @Expose()
  isBeam: boolean // คาน

  @Expose()
  isWheelArch: boolean // ซุ้มล้อ

  @Expose()
  isControlArm: boolean // ปีกนก

  @Expose()
  isChassis: boolean // แชสซี่ส์

  @Expose()
  isUnderbody: boolean // ใต้ท้อง
}

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
  @Type(() => ProductResponse)
  product: ProductResponse

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
