import { IsNotEmpty, IsOptional } from 'class-validator'

export class ProductCatagoryResquest {
  @IsOptional()
  _id: string

  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  code: string
}
