import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
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

  @Get(':expenseId')
  getExpenseById(
    @Param('expenseId') expenseId: string,
  ): Promise<ExpenseResponse> {
    return this.expensesService.getExpenseById(expenseId)
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

  @Post('approve/:expenseId')
  approveExpenseById(
    @Param('expenseId') expenseId: string,
    @Body() approveExpenseRequest: ExpenseRequest,
  ) {
    return this.expensesService.approveExpenseById(
      expenseId,
      approveExpenseRequest,
    )
  }

  @Post('cencel/:expenseId')
  cencelExpenseById(
    @Param('expenseId') expenseId: string,
    @Body() approveExpenseRequest: ExpenseRequest,
  ) {
    return this.expensesService.cencelExpenseById(
      expenseId,
      approveExpenseRequest,
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

  @Delete(':expenseId')
  deleteExpenseById(@Param('expenseId') expenseId: string) {
    return this.expensesService.deleteExpenseById(expenseId)
  }
}
