import { IsOptional } from 'class-validator'

export class QueryPagination {
  @IsOptional()
  term?: string

  @IsOptional()
  receiptBookNo?: string
}
