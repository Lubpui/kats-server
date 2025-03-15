import { Expose } from 'class-transformer'

export class ProductResponse {
  @Expose()
  position: string

  @Expose()
  name: string

  @Expose()
  code: string
}
