import { Expose, Type } from 'class-transformer'

export class EmployeeResponse {
  @Expose()
  staffRole: string

  @Expose()
  name: string

  @Expose()
  tel: string
}

export class EmployeeListResponse {
  @Expose()
  @Type(() => EmployeeResponse)
  data: EmployeeResponse[]
}
