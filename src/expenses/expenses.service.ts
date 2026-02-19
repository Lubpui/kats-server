import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Expense, ExpenseDocument } from './schemas/expense.schema'
import { Model, Types } from 'mongoose'
import { ExpenseRequest } from './requests/expense.request'
import {
  ExpenseListResponse,
  ExpenseResponse,
} from './responses/expense.response'
import { modelMapper } from 'src/utils/mapper.util'
import { DocumentCountService } from 'src/document-count/document-count.service'
import {
  DocumentCount,
  DocumentCountDocument,
} from 'src/document-count/schemas/document-count.schema'
import { CUSTOM_CONNECTION_NAME } from 'src/utils/constanrs'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'
import { UserResponse } from 'src/users/responses/user.response'
import { deleteFile } from 'src/utils/common.util'
import path from 'path'
import * as fs from 'fs-extra'

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name, CUSTOM_CONNECTION_NAME)
    private readonly expenseModel: Model<ExpenseDocument>,
    @InjectModel(DocumentCount.name, CUSTOM_CONNECTION_NAME)
    private readonly documentCountModel: Model<DocumentCountDocument>,
    private readonly documentCountService: DocumentCountService,
  ) {}

  async handleAdjustFile(payload: {
    newFileName: string | undefined
    oldFileName: string | undefined
    dbname: string
  }) {
    const { newFileName, oldFileName, dbname } = payload
    const dirname = path.join(process.env.UPLOAD_PATH ?? '', dbname, 'expenses')

    let imageRes: string | undefined = undefined

    if (newFileName !== oldFileName) {
      //ลบไฟล์เดิม
      if (oldFileName && fs.existsSync(path.join(dirname, oldFileName))) {
        await deleteFile(path.join(dirname, oldFileName))
      }

      //สร้างไฟล์
      if (newFileName) {
        const originPath = path.join(process.env.TMP_PATH ?? '', newFileName)
        const destinationPath = path.join(dirname, newFileName)
        if (!fs.existsSync(dirname)) {
          fs.mkdirSync(dirname, { recursive: true })
        }
        await fs.copy(originPath, destinationPath, { overwrite: true })
        imageRes = newFileName
      }
    }

    return imageRes
  }

  async createExpense(
    createExpenseRequest: ExpenseRequest,
  ): Promise<ExpenseResponse> {
    const session = await this.documentCountModel.startSession()
    session.startTransaction()

    try {
      const { employeeId } = createExpenseRequest

      const code = await this.documentCountService.getExpenseCode(session)

      const newExpense = {
        ...createExpenseRequest,
        employeeId: new Types.ObjectId(employeeId),
        codeId: code,
      }

      const createdEmployee = await new this.expenseModel(newExpense).save()

      const expensesResponse = await this.expenseModel
        .findById(createdEmployee._id)
        .populate('employee')

      await session.commitTransaction()
      return modelMapper(ExpenseResponse, expensesResponse)
    } catch (error) {
      console.log(error)
      await session.abortTransaction() // rollbackASDF
      throw error
    } finally {
      session.endSession()
    }
  }

  async getAllExpenses(del: number): Promise<ExpenseResponse[]> {
    const ExpenseRes = await this.expenseModel.find().populate('employee')
    const Expenses = modelMapper(ExpenseListResponse, { data: ExpenseRes }).data

    const filterdExpenses = Expenses.filter(
      (Expense) => Expense.delete === (del as DeleteStatus),
    )

    return filterdExpenses
  }

  async getExpenseById(expenseId: string): Promise<ExpenseResponse> {
    const Expense = await this.expenseModel
      .findById(expenseId)
      .populate('employee')
    return modelMapper(ExpenseResponse, Expense)
  }

  async updateExpenseById(
    userInfo: UserResponse,
    expenseId: string,
    updateExpenseRequest: ExpenseRequest,
  ) {
    const { dbname } = userInfo
    const { slip: newSlip } = updateExpenseRequest

    const booking = await this.expenseModel.findById(expenseId, {
      slip: 1,
      image: 1,
    })
    if (!booking) throw new NotFoundException('ไม่พบ expense')

    const { slip: oldSlip } = booking

    const slipPath = await this.handleAdjustFile({
      newFileName: newSlip,
      oldFileName: oldSlip,
      dbname,
    })

    updateExpenseRequest.slip = slipPath

    const Expenses = await this.expenseModel.findByIdAndUpdate(expenseId, {
      $set: { ...updateExpenseRequest },
    })
    return Expenses
  }

  async approveExpenseById(
    userInfo: UserResponse,
    expenseId: string,
    approveExpenseRequest: ExpenseRequest,
  ) {
    const approve = await this.updateExpenseById(
      userInfo,
      expenseId,
      approveExpenseRequest,
    )

    return approve
  }

  async cencelExpenseById(
    userInfo: UserResponse,
    expenseId: string,
    approveExpenseRequest: ExpenseRequest,
  ) {
    const approve = await this.updateExpenseById(
      userInfo,
      expenseId,
      approveExpenseRequest,
    )

    return approve
  }

  async isDeleteExpenseById(
    userInfo: UserResponse,
    expenseId: string,
    updateStatusDeleteRequest: ExpenseRequest,
  ) {
    const updateStatus = await this.updateExpenseById(
      userInfo,
      expenseId,
      updateStatusDeleteRequest,
    )

    return updateStatus
  }

  async deleteExpenseById(expenseId: string) {
    const expense = await this.expenseModel.findByIdAndDelete(expenseId)
    return expense
  }
}
