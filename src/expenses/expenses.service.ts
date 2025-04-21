import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Expense, ExpenseDocument } from './schemas/expense.schema'
import { Model } from 'mongoose'
import { ExpenseRequest } from './requests/expense.request'
import {
  ExpenseListResponse,
  ExpenseResponse,
} from './responses/expense.response'
import { modelMapper } from 'src/utils/mapper.util'

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name)
    private readonly ExpenseModel: Model<ExpenseDocument>,
  ) {}

  async createExpense(
    createExpenseRequest: ExpenseRequest,
  ): Promise<ExpenseResponse> {
    try {
      const createdExpense = await new this.ExpenseModel(
        createExpenseRequest,
      ).save()

      return modelMapper(ExpenseResponse, createdExpense)
    } catch (error) {
      throw error
    }
  }

  async getAllExpenses(): Promise<ExpenseResponse[]> {
    const Expenses = await this.ExpenseModel.find()
    return modelMapper(ExpenseListResponse, { data: Expenses }).data
  }
}
