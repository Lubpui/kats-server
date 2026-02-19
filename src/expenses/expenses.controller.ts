import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ExpensesService } from './expenses.service'
import { ExpenseResponse } from './responses/expense.response'
import { ExpenseRequest } from './requests/expense.request'
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard'
import { UserInfo } from 'src/shared/decorators/user-info.decorator'
import { UserResponse } from 'src/users/responses/user.response'

@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  createExpense(@Body() createExpenseRequest: ExpenseRequest) {
    return this.expensesService.createExpense(createExpenseRequest)
  }

  @Get()
  getAllExpenses(@Query('delete') del: string): Promise<ExpenseResponse[]> {
    return this.expensesService.getAllExpenses(Number(del))
  }

  @Get(':expenseId')
  getExpenseById(
    @Param('expenseId') expenseId: string,
  ): Promise<ExpenseResponse> {
    return this.expensesService.getExpenseById(expenseId)
  }

  @Put(':expenseId')
  updateExpenseById(
    @UserInfo() userInfo: UserResponse,
    @Param('expenseId') expenseId: string,
    @Body() updateBookingRequest: ExpenseRequest,
  ) {
    return this.expensesService.updateExpenseById(
      userInfo,
      expenseId,
      updateBookingRequest,
    )
  }

  @Post('approve/:expenseId')
  approveExpenseById(
    @UserInfo() userInfo: UserResponse,
    @Param('expenseId') expenseId: string,
    @Body() approveExpenseRequest: ExpenseRequest,
  ) {
    return this.expensesService.approveExpenseById(
      userInfo,
      expenseId,
      approveExpenseRequest,
    )
  }

  @Post('cencel/:expenseId')
  cencelExpenseById(
    @UserInfo() userInfo: UserResponse,
    @Param('expenseId') expenseId: string,
    @Body() approveExpenseRequest: ExpenseRequest,
  ) {
    return this.expensesService.cencelExpenseById(
      userInfo,
      expenseId,
      approveExpenseRequest,
    )
  }

  @Post('selectDelete/:expenseId')
  isDeleteExpenseById(
    @UserInfo() userInfo: UserResponse,
    @Param('expenseId') expenseId: string,
    @Body() updateStatusDeleteRequest: ExpenseRequest,
  ) {
    return this.expensesService.isDeleteExpenseById(
      userInfo,
      expenseId,
      updateStatusDeleteRequest,
    )
  }

  @Delete(':expenseId')
  deleteExpenseById(@Param('expenseId') expenseId: string) {
    return this.expensesService.deleteExpenseById(expenseId)
  }
}
