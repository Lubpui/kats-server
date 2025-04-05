export enum EmployeeRole {
  CEO = 0, // หัวหน้า
  AMIN = 1, // ผู้ดูแลระบบ
  WASHTECNICIAN = 2, // ช่างล้างรถ
  SPRAYER = 3, // ช่างพ่นสี
}

export enum PaymentStatus {
  BANK = 0, // เงินสด
  CASH = 1, // ธนาคาร
}

export enum PaymentType {
  MONTHLY = 0, // รายวัน
  DAILY = 1, // รายเดือน
}

export enum BankType {
  BANK_OF_AYUDHYA = 0, // ธนาคารกรุงศรีอยุธยา
  BANGKOK_BANK = 1, // ธนาคารกรุงเทพ
  KRUNG_THAI_BANK = 2, // ธนาคารกรุงไทย
  KASIKORNBANK = 3, // ธนาคารกสิกรไทย
  TMBTHANACHART_BANK = 4, // ธนาคารทหารไทยธนชาต
  GOVERNMENT_SAVINGS_BANK = 5, // ธนาคารออมสิน
  SIAM_COMMERCIAL_BANK = 6, // ธนาคารไทยพาณิชย์
}
