import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { LogInRequest } from './requests/login.request'
import { SharedService } from 'src/utils/shared.service'
import { createUserPayload } from 'src/utils/auth.util'
import { modelMapper } from 'src/utils/mapper.util'
import { LogInResponse } from './responses/login.response'
import { CreateUserRequest } from 'src/users/requests/user.request'
import { UsersService } from 'src/users/users.service'
import { ChangePasswordRequest } from './requests/change-password.request'
import { ChangePasswordResponse } from './responses/change-password.response'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from 'src/users/schemas/user.schema'
import { Model } from 'mongoose'
import { MAIN_CONNECTION_NAME } from 'src/utils/constanrs'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sharedService: SharedService,
    private readonly userService: UsersService,
    @InjectModel(User.name, MAIN_CONNECTION_NAME)
    private userModel: Model<UserDocument>,
  ) {}

  async login(loginRequest: LogInRequest) {
    try {
      const user = await this.sharedService.validateUser(loginRequest)
      const newPayload = createUserPayload(user, this.jwtService, false)
      return modelMapper(LogInResponse, newPayload)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async createNewAccount(createUserRequest: CreateUserRequest) {
    const newUser = await this.userService.createNewAccount(createUserRequest)
    return newUser
  }

  async changePassword(
    userId: string,
    changePasswordRequest: ChangePasswordRequest,
  ) {
    const { oldPassword, newPassword, confirmPassword } = changePasswordRequest

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน')
    }

    // Validate old and new passwords are different
    if (oldPassword === newPassword) {
      throw new BadRequestException('รหัสผ่านใหม่ต้องแตกต่างจากรหัสผ่านเดิม')
    }

    try {
      // Find user by ID
      const user = await this.userModel.findById(userId)
      if (!user) {
        throw new NotFoundException('ไม่พบข้อมูลผู้ใช้งาน')
      }

      // Verify old password
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password)
      if (!isPasswordValid) {
        throw new BadRequestException('รหัสผ่านเดิมไม่ถูกต้อง')
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10)

      // Update password
      await this.userModel.updateOne(
        { _id: userId },
        { password: hashedPassword },
      )

      return modelMapper(ChangePasswordResponse, {
        message: 'เปลี่ยนรหัสผ่านสำเร็จ',
        success: true,
      })
    } catch (error) {
      throw error
    }
  }
}
