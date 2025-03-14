import { IsNotEmpty } from 'class-validator'

export class ProductResponse {
  @IsNotEmpty()
  position: string

  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  code: string
}
