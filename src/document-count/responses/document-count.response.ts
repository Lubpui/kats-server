import { Expose } from 'class-transformer'

export class DocumentCountResponse {
  @Expose()
  expenseCount: number

  @Expose()
  bookingCount: number
}
