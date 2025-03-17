import { Expose } from 'class-transformer'

export class EmployeeResponse {
  @Expose()
  position: string

  @Expose()
  name: string

  @Expose()
  code: string
}
