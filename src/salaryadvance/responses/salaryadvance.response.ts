import { Expose, Type } from 'class-transformer'
import { IsEnum } from 'class-validator'
import { Category_Type, PaymentCategory } from 'src/shared/enums/expense.enum'

export class SalaryAdvanceCatagoryResponse {
  @Expose()
  @IsEnum(Category_Type)
  type: Category_Type

  @Expose()
  amount: number
}

export class SalaryAdvanceResponse {
  @Expose()
  _id: string

  @Expose()
  number: number

  @Expose()
  productId: string

  @Expose()
  ownerName: string

  @Expose()
  @IsEnum(PaymentCategory)
  section: PaymentCategory

  @Expose()
  categorys: [SalaryAdvanceCatagoryResponse]

  @Expose()
  price: number

  @Expose()
  date: string

  @Expose()
  datePrice: string

  @Expose()
  detel: string
}

export class SalaryAdvanceListResponse {
  @Expose()
  @Type(() => SalaryAdvanceResponse)
  data: SalaryAdvanceResponse[]
}
