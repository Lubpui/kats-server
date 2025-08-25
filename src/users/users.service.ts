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
import {
  CUSTOM_CONNECTION_NAME,
  MAIN_CONNECTION_NAME,
} from 'src/utils/constanrs'
import {
  DocumentCount,
  DocumentCountDocument,
  DocumentCountSchema,
} from 'src/document-count/schemas/document-count.schema'
import { EmployeeRequest } from 'src/employees/requests/employee.request'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name, MAIN_CONNECTION_NAME)
    private userModel: Model<UserDocument>,
    @InjectModel(Employee.name, CUSTOM_CONNECTION_NAME)
    private employeeModel: Model<EmployeeDocument>,
    @InjectModel(DocumentCount.name, CUSTOM_CONNECTION_NAME)
    private documentCountModel: Model<DocumentCountDocument>,
    private readonly configService: ConfigService,
    private readonly permissionService: PermissionsService,
  ) {}

  async createNewAccount(createUserRequest: CreateUserRequest) {
    const { email, phoneNumber, firstName, lastName, companyName } =
      createUserRequest

    // Check if email already exists
    const isEmailExist = await this.userModel.exists({ email })
    if (isEmailExist)
      throw new HttpException({ message: 'This email is already in use.' }, 409)

    // Check if companyName already exists
    const isCompanyExist = await this.userModel.exists({ companyName })
    if (isCompanyExist)
      throw new HttpException(
        { message: 'This company name is already in use.' },
        409,
      )

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

      const documentCountModel = connection.model<DocumentCountDocument>(
        DocumentCount.name,
        DocumentCountSchema as any,
      )

      await documentCountModel.insertOne({ expenseCount: 0, bookingCount: 0 })

      const CEORole = await this.permissionService.createInitialRole(roleModel)

      const newUser = await this.createUser(
        dbname,
        new Types.ObjectId(CEORole._id),
        createUserRequest,
        true,
      )

      const createEmployeeRequest: EmployeeRequest = {
        firstName,
        lastName,
        employmentInfo: {
          roleId: newUser.roleId,
        },
        tel: phoneNumber ?? '',
        email: newUser.email,
        delete: DeleteStatus.ISNOTDELETE,
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
      dbname,
      password: hashPassword,
    }

    const newUser = await new this.userModel(newSignUpRequest).save()
    const user = modelMapper(UserResponse, newUser)

    return { ...user, dbname }
  }

  async getUserProfile(userInfo: UserResponse): Promise<any> {
    const findedUser = await this.userModel.findById(userInfo._id, {
      password: 0,
    })

    const findedEmployee = await this.employeeModel
      .findOne({
        email: userInfo.email,
      })
      .populate('employmentInfo.role')

    return { userInfo: findedUser, employee: findedEmployee }
  }
}
