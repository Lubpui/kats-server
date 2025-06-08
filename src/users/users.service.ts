import { HttpException, Injectable } from '@nestjs/common'
import { CreateUserRequest } from './requests/user.request'
import { User, UserDocument } from './schemas/user.schema'
import { createConnection, Model, Types } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { modelMapper } from 'src/utils/mapper.util'
import { UserResponse } from './responses/user.response'
import { ConfigService } from '@nestjs/config'
import {
  Role,
  RoleDocument,
  RoleSchema,
} from 'src/permissions/schemas/role.schema'
import * as bcrypt from 'bcrypt'
import { PermissionsService } from 'src/permissions/permissions.service'
import {
  Employee,
  EmployeeDocument,
  EmployeeSchema,
} from 'src/employees/schemas/employee.schema'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
    private readonly permissionService: PermissionsService,
  ) {}

  async createNewAccount(createUserRequest: CreateUserRequest) {
    const { email, phoneNumber, firstName, lastName, companyName } =
      createUserRequest

    const isEmailExist = await this.userModel.exists({ email })
    if (isEmailExist)
      throw new HttpException({ message: 'This email is already in use.' }, 409)

    const dbname = String(companyName)
    const connection = await createConnection(
      `${this.configService.get<string>('MONGO_URI')}/${dbname}?authSource=admin`,
    ).asPromise()

    try {
      const roleModel = connection.model<RoleDocument>(
        Role.name,
        RoleSchema as any,
      )

      const employeeModelCustom = connection.model<EmployeeDocument>(
        Employee.name,
        EmployeeSchema as any,
      )

      const CEORole = await this.permissionService.createInitialRole(roleModel)

      const newUser = await this.createUser(
        dbname,
        new Types.ObjectId(CEORole._id),
        createUserRequest,
        true,
      )

      const createEmployeeRequest = {
        name: `${firstName} ${lastName}`,
        roleId: new Types.ObjectId(newUser.roleId),
        tel: phoneNumber,
      }

      await new employeeModelCustom(createEmployeeRequest).save()

      return newUser
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async createUser(
    dbname: string,
    roleId: Types.ObjectId,
    signUpRequest: CreateUserRequest,
    isOwner: boolean = false,
  ): Promise<UserResponse> {
    const { password } = signUpRequest
    const hashPassword = await bcrypt.hash(password, 10)

    const newSignUpRequest = {
      ...signUpRequest,
      roleId,
      isOwner,
      dbnames: [dbname],
      password: hashPassword,
    }

    const newUser = await new this.userModel(newSignUpRequest).save()
    const user = modelMapper(UserResponse, newUser)

    return { ...user, dbname }
  }
}
