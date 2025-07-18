import { Expose, Type } from 'class-transformer'
import { IsEnum } from 'class-validator'
import { EmployeeResponse } from 'src/employees/responses/employee.response'
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'
import { ExpenseStatus, PaymentCategory } from 'src/shared/enums/expense.enum'
import { ExpenseCatagoryResponse } from './expense-catagory.response'

export class ExpenseResponse {
  @Expose()
  _id: string

  @Expose()
  codeId: number

  @Expose()
  @Type(() => EmployeeResponse)
  employee: EmployeeResponse

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
  date: string

  @Expose()
  datePrice: string

  @Expose()
  detel: string

  @Expose()
  slip: string

  @Expose()
  delete: DeleteStatus

  @Expose()
  status: ExpenseStatus
}

export class ExpenseListResponse {
  @Expose()
  @Type(() => ExpenseResponse)
  data: ExpenseResponse[]
}
