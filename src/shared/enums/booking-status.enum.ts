export enum BookingStatus {
  PENDING = 0, // รอจ่ายเงิน
  PAID = 1, // จ่ายเงินแล้ว
  COMPLETED = 2, // เสร็จสิ้น
  CANCELED = 3, // ยกเลิก
  CHECKING = 4, // เช็คสภาพรถยนต์
}
