import { Type } from 'class-transformer'
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'
import { PaymentCategory } from 'src/shared/enums/expense.enum'

export class ExpenseCatagoryRequest {
  @IsNotEmpty()
  type: number

  @IsNotEmpty()
  amount: number
}

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
  @Type(() => ExpenseCatagoryRequest)
  @ValidateNested()
  categorys: ExpenseCatagoryRequest[]

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
