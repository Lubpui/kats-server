export interface JwtPayload {
  userId: string
  company: string
  isAdmin: boolean
  isZant: boolean
  isRefreshToken: boolean
  iat: number
  exp: number
  aud: string
  iss: string
  sub: string
}
