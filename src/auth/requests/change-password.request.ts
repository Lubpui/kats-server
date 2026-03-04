import { IsNotEmpty, MinLength, IsString } from 'class-validator'

export class ChangePasswordRequest {
  @IsNotEmpty({ message: 'รหัสผ่านเดิมจำเป็นต้องระบุ' })
  @IsString()
  oldPassword: string

  @IsNotEmpty({ message: 'รหัสผ่านใหม่จำเป็นต้องระบุ' })
  @IsString()
  @MinLength(6, { message: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร' })
  newPassword: string

  @IsNotEmpty({ message: 'การยืนยันรหัสผ่านจำเป็นต้องระบุ' })
  @IsString()
  confirmPassword: string
}
