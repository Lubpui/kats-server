import { IsNotEmpty } from 'class-validator'
import { ExpenseCatagoryResponse } from 'src/expenses/responses/expense.response'
import { PaymentCategory } from 'src/shared/enums/expense.enum'

export class SalaryAdvanceRequest {
  @IsNotEmpty()
  number: number

  @IsNotEmpty()
  productId: string

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
}
