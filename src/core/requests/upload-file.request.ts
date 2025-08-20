import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class UploadFileRequest {
  @IsString()
  readonly session_id: string

  @IsString()
  readonly original_name: string

  @IsString()
  readonly content: string

  @IsNumber()
  readonly index: number

  @IsNumber()
  readonly total: number

  @IsBoolean()
  @IsOptional()
  readonly is_use_orginal_name?: boolean
}
