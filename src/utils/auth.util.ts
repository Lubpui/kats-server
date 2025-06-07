import { JwtService } from '@nestjs/jwt'
import { UserResponse } from 'src/users/responses/user.response'
import ms from 'ms'

export const createUserPayload = (
  user: UserResponse,
  jwtService: JwtService,
  isZant = false,
) => {
  const { _id, dbname } = user

  // NOTE: create token
  const payload = { userId: _id, company: dbname, isZant }
  const accessToken = jwtService.sign(payload, {
    issuer: process.env.JWT_ISSUER,
    expiresIn: process.env.JWT_EXPIRES,
    algorithm: <any>process.env.JWT_ALGORITHM,
  })

  const payloadRefreshToken = {
    userId: _id,
    company: dbname,
    isRefreshToken: true,
  }
  const refreshToken = jwtService.sign(payloadRefreshToken, {
    issuer: process.env.JWT_ISSUER,
    expiresIn: process.env.JWT_REFRESH_EXPIRES,
    algorithm: <any>process.env.JWT_ALGORITHM,
  })

  return {
    user,
    accessToken,
    expiresIn: Math.floor(
      (Date.now() + ms(isZant ? '1h' : process.env.JWT_EXPIRES)) / 1000,
    ),
    ...(!isZant && { refreshToken: refreshToken }),
    ...(!isZant && {
      refreshExpiresIn: Math.floor(
        (Date.now() + ms(process.env.JWT_REFRESH_EXPIRES)) / 1000,
      ),
    }),
  }
}
