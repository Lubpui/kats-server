import { IsNotEmpty } from 'class-validator'

export class DocumentCountRequest {
  @IsNotEmpty()
  expenseCount: number

  @IsNotEmpty()
  bookingCount: number
}
