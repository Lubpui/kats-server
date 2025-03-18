import { Expose } from 'class-transformer'

export class EmployeeResponse {
  @Expose()
  staffRole: string

  @Expose()
  name: string

  @Expose()
  tel: string
}
