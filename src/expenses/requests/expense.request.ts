import { IsNotEmpty, IsOptional } from 'class-validator'
import { ExpenseCatagoryResponse } from '../responses/expense.response'
import { PaymentCategory } from 'src/shared/enums/expense.enum'

export class ExpenseRequest {
  @IsNotEmpty()
  number: number

  @IsNotEmpty()
  employeeId: string

  @IsNotEmpty()
  ownerName: string

  @IsNotEmpty()
  section: PaymentCategory

  @IsNotEmpty()
  categorys: [ExpenseCatagoryResponse]

  @IsNotEmpty()
  price: number

  @IsNotEmpty()
  date: string

  @IsNotEmpty()
  datePrice: string

  @IsNotEmpty()
  detel: string

  @IsOptional()
  slip?: string
}
