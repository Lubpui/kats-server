import { Expose } from 'class-transformer'
import { IsEnum } from 'class-validator'
import { CategoryType } from 'src/shared/enums/expense.enum'

export class ExpenseCatagoryResponse {
  @Expose()
  _id: string
  
  @Expose()
  @IsEnum(CategoryType)
  type: CategoryType

  @Expose()
  amount: number
}
