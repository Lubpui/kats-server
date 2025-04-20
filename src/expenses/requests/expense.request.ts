import { IsNotEmpty } from 'class-validator'
import { BookingStatus } from 'src/shared/enums/booking-status.enum'
import { ExpenseCatagoryResponse } from '../responses/expense.response'

export class ExpenseRequest {
  @IsNotEmpty()
  number: string

  @IsNotEmpty()
  productId: string

  @IsNotEmpty()
  ownerName: string

  @IsNotEmpty()
  section: BookingStatus

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
