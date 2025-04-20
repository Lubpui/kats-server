import { Body, Controller, Get, Post } from '@nestjs/common'
import { ExpensesService } from './expenses.service'
import { ExpenseResponse } from './responses/expense.response'
import { ExpenseRequest } from './requests/expense.request'

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  createExpense(@Body() createExpenseRequest: ExpenseRequest) {
    return this.expensesService.createExpense(createExpenseRequest)
  }

  @Get()
  getAllExpenses(): Promise<ExpenseResponse[]> {
    return this.expensesService.getAllExpenses()
  }
}
