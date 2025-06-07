import { Expose } from 'class-transformer'

export class UserResponse {
  @Expose()
  _id: string

  @Expose()
  firstName: string

  @Expose()
  lastName: string

  @Expose()
  email: string

  @Expose()
  nickName: string

  @Expose()
  userName: string
}
