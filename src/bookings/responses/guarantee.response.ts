import { Expose } from 'class-transformer'
import { BookingStatus } from 'src/shared/enums/booking-status.enum'

export class GuaranteeResponse {
  @Expose()
  serviceNo: number // ครั้งที่

  @Expose()
  serviceDate: string // วันที่เข้ารับบริการ

  @Expose()
  serviceTime: string // เวลาเข้ารับบริการ

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
