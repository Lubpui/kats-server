export enum PaymentCategory {
  WITHDRAW = 0,
  SALARY = 1,
}

export enum ExpenseStatus {
  PENDING = 0,
  APPROVE = 1,
  CANCEL = 2,
}

export enum CategoryType {
  FUEL = 0, // น้ำมัน
  TRAVEL = 1, // เดินทาง
  ACCOMMODATION = 2, // ที่พัก
  ALLOWANCE = 3, // เบี้ยเลี้ยง
  TRANSPORT = 4, // ขนส่ง
  TOOL = 5, // อุปกรณ์
  MEDICAL = 6, // รักษา
  OTHER = 7, // อื่นๆ
  SALARY_ADVANCE = 8, // เบิกเงินเดือน
  PAYROLL = 9, // เงินเดือนพนักงาน
}
