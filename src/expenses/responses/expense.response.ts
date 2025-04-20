import { Expose, Type } from 'class-transformer'
import { IsEnum } from 'class-validator'
import { BookingStatus } from 'src/shared/enums/booking-status.enum'
import { Category_Type } from 'src/shared/enums/expense.enum'

export class ExpenseCatagoryResponse {
  @Expose()
  @IsEnum(Category_Type)
  type: Category_Type

  @Expose()
  amount: number
}

export class ExpenseResponse {
  @Expose()
  _id: string

  @Expose()
  number: string

  @Expose()
  productId: string

  @Expose()
  ownerName: string

  @Expose()
  @IsEnum(BookingStatus)
  section: BookingStatus

  @Expose()
  categorys: [ExpenseCatagoryResponse]

  @Expose()
  price: number

  @Expose()
  date: string

  @Expose()
  datePrice: string

  @Expose()
  detel: string
}

export class ExpenseListResponse {
  @Expose()
  @Type(() => ExpenseResponse)
  data: ExpenseResponse[]
}
