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
      const { employeeId } = createExpenseRequest

      const newEmployee = {
        ...createExpenseRequest,
        employeeId: new Types.ObjectId(employeeId),
      }

      const createdEmployee = await new this.ExpenseModel(newEmployee).save()

      const expensesResponse = await this.ExpenseModel.findById(
        createdEmployee._id,
      ).populate('employee')

      return modelMapper(ExpenseResponse, expensesResponse)
    } catch (error) {
      throw error
    }
  }

  async getAllExpenses(): Promise<ExpenseResponse[]> {
    const Expenses = await this.ExpenseModel.find().populate('employee')
    return modelMapper(ExpenseListResponse, { data: Expenses }).data
  }
}
