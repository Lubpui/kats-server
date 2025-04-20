import { Expose, Type } from 'class-transformer'
import { IsEnum } from 'class-validator'
import { CategoryType, PaymentCategory } from 'src/shared/enums/expense.enum'

export class ExpenseCatagoryResponse {
  @Expose()
  @IsEnum(CategoryType)
  type: CategoryType

  @Expose()
  amount: number
}

export class ExpenseResponse {
  @Expose()
  _id: string

  @Expose()
  number: number

  @Expose()
  employeeId: string

  @Expose()
  ownerName: string

  @Expose()
  @IsEnum(PaymentCategory)
  section: PaymentCategory

  @Expose()
  categorys: ExpenseCatagoryResponse[]

  @Expose()
  price: number

  @Expose()
  date: string

  @Expose()
  datePrice: string

  @Expose()
  detel: string

  @Expose()
  slip: string
}

export class ExpenseListResponse {
  @Expose()
  @Type(() => ExpenseResponse)
  data: ExpenseResponse[]
}
