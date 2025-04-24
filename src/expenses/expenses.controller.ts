import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
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

  @Put(':expenseId')
  updateExpenseById(
    @Param('expenseId') expenseId: string,
    @Body() updateBookingRequest: ExpenseRequest,
  ) {
    return this.expensesService.updateExpenseById(
      expenseId,
      updateBookingRequest,
    )
  }

  @Post('selectDelete/:expenseId')
  isDeleteExpenseById(
    @Param('expenseId') expenseId: string,
    @Body() updateStatusDeleteRequest: ExpenseRequest,
  ) {
    return this.expensesService.isDeleteExpenseById(
      expenseId,
      updateStatusDeleteRequest,
    )
  }
}
