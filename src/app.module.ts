import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ProductsModule } from './products/products.module'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EmployeesModule } from './employees/employees.module'
import { ExpensesModule } from './expenses/expenses.module'
import { DocumentCountModule } from './document-count/document-count.module'
import { PermissionsModule } from './permissions/permissions.module'
import { BookingsModule } from './bookings/bookings.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { DashboardModule } from './dashboard/dashboard.module'
import {
  CUSTOM_CONNECTION_NAME,
  MAIN_CONNECTION_NAME,
  MAIN_DATABASE_NAME,
} from './utils/constanrs'
import { JwtModule } from '@nestjs/jwt'
import { MongooseService } from './mongoose.service'
import { CoreModule } from './core/core.module'
import fs from 'fs'

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    EmployeesModule,
    BookingsModule,
    ExpensesModule,
    DashboardModule,
    DocumentCountModule,
    PermissionsModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: `${configService.get<string>('MONGO_URI')}/${MAIN_DATABASE_NAME}?authSource=admin`,
      }),
      inject: [ConfigService],
      connectionName: MAIN_CONNECTION_NAME,
    }),
    MongooseModule.forRootAsync({
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => {
            const privPath = configService.get<string>(
              'JWT_SIGN_PRIVATE_KEY_PATH',
            )
            const pubPath = configService.get<string>(
              'JWT_SIGN_PUBLIC_KEY_PATH',
            )

            let privateKey = ''
            let publicKey = ''

            if (privPath) {
              try {
                privateKey = fs.readFileSync(privPath, 'utf8')
              } catch (err) {
                console.error(
                  'Failed to read private key file at',
                  privPath,
                  err,
                )
                throw err
              }
            } else {
              const rawPriv = String(
                configService.get('JWT_SIGN_PRIVATE_KEY') || '',
              )
              privateKey = rawPriv.replace(/\\n/g, '\n')
            }

            if (pubPath) {
              try {
                publicKey = fs.readFileSync(pubPath, 'utf8')
              } catch (err) {
                console.error('Failed to read public key file at', pubPath, err)
                throw err
              }
            } else {
              const rawPub = String(
                configService.get('JWT_SIGN_PUBLIC_KEY') || '',
              )
              publicKey = rawPub.replace(/\\n/g, '\n')
            }

            console.error('JwtModule init keys length:', {
              privateKeyLen: privateKey.length,
              publicKeyLen: publicKey.length,
            })

            return {
              privateKey,
              publicKey,
              signOptions: {
                issuer: configService.get('JWT_ISSUER'),
                expiresIn: configService.get('JWT_EXPIRES'),
                algorithm: configService.get('JWT_ALGORITHM'),
              },
            }
          },
          inject: [ConfigService],
        }),
      ],
      useClass: MongooseService,
      connectionName: CUSTOM_CONNECTION_NAME,
    }),
    CoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
