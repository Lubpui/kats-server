import { Expose } from 'class-transformer'

export class ChangePasswordResponse {
  @Expose()
  message: string

  @Expose()
  success: boolean
}
