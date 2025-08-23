import { JwtService } from '@nestjs/jwt'
import { UserResponse } from 'src/users/responses/user.response'
import ms from 'ms'

export const createUserPayload = (
  user: UserResponse,
  jwtService: JwtService,
  isZant = false,
) => {
  if (!user || !user._id) throw new Error('invalid user for createUserPayload')
  if (!jwtService || typeof jwtService.sign !== 'function')
    throw new Error('jwtService missing or invalid')

  const { JWT_ISSUER, JWT_EXPIRES, JWT_ALGORITHM } = process.env

  try {
    const { _id, dbname } = user

    // NOTE: create token
    const payload = { userId: _id, company: dbname, isZant }

    const accessOptions: any = {
      issuer: JWT_ISSUER || undefined,
      algorithm: JWT_ALGORITHM || undefined,
      expiresIn: JWT_EXPIRES || undefined,
    }

    let accessToken: string
    try {
      accessToken = jwtService.sign(payload, accessOptions)
    } catch (e) {
      console.error(
        'Failed to sign access token:',
        e && e.message,
        e && e.stack,
        { accessOptions },
      )
      throw e
    }

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
  } catch (error) {
    throw error
  }
}
