import { IsNotEmpty, IsOptional } from 'class-validator'

export class ProductCatagoryRequest {
  @IsOptional()
  _id: string

  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  code: string
}
