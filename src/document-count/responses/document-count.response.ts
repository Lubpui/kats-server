import { Expose, Type } from 'class-transformer'

export class DocumentCountResponse {
  @Expose()
  expenseCount: number

  @Expose()
  bookingCount: number
}

export class DocumentCountListResponse {
  @Expose()
  @Type(() => DocumentCountResponse)
  data: DocumentCountResponse[]
}
