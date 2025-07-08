import { Injectable } from '@nestjs/common'
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

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name ,CUSTOM_CONNECTION_NAME)
    private readonly expenseModel: Model<ExpenseDocument>,
    @InjectModel(DocumentCount.name ,CUSTOM_CONNECTION_NAME)
    private readonly documentCountModel: Model<DocumentCountDocument>,
    private readonly documentCountService: DocumentCountService,
  ) {}

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

  async getAllExpenses(): Promise<ExpenseResponse[]> {
    const Expenses = await this.expenseModel.find().populate('employee')
    return modelMapper(ExpenseListResponse, { data: Expenses }).data
  }

  async getExpenseById(expenseId: string): Promise<ExpenseResponse> {
    const Expense = await this.expenseModel
      .findById(expenseId)
      .populate('employee')
    return modelMapper(ExpenseResponse, Expense)
  }

  async updateExpenseById(
    expenseId: string,
    updateExpenseRequest: ExpenseRequest,
  ) {
    const Expenses = await this.expenseModel.findByIdAndUpdate(expenseId, {
      $set: { ...updateExpenseRequest },
    })
    return Expenses
  }

  async approveExpenseById(
    expenseId: string,
    approveExpenseRequest: ExpenseRequest,
  ) {
    const approve = await this.updateExpenseById(
      expenseId,
      approveExpenseRequest,
    )

    return approve
  }

  async cencelExpenseById(
    expenseId: string,
    approveExpenseRequest: ExpenseRequest,
  ) {
    const approve = await this.updateExpenseById(
      expenseId,
      approveExpenseRequest,
    )

    return approve
  }

  async isDeleteExpenseById(
    expenseId: string,
    updateStatusDeleteRequest: ExpenseRequest,
  ) {
    const updateStatus = await this.updateExpenseById(
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
