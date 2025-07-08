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
import {
  CUSTOM_CONNECTION_NAME,
  MAIN_CONNECTION_NAME,
  MAIN_DATABASE_NAME,
} from './utils/constanrs'
import { JwtModule } from '@nestjs/jwt'
import { MongooseService } from './mongoose.service'

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    EmployeesModule,
    BookingsModule,
    ExpensesModule,
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
          useFactory: async (configService: ConfigService) => ({
            privateKey: String(
              configService.get('JWT_SIGN_PRIVATE_KEY'),
            ).replace(/\\n/g, '\n'),
            publicKey: String(configService.get('JWT_SIGN_PUBLIC_KEY')).replace(
              /\\n/g,
              '\n',
            ),
            signOptions: {
              issuer: configService.get('JWT_ISSUER'),
              expiresIn: configService.get('JWT_EXPIRES'),
              algorithm: configService.get('JWT_ALGORITHM'),
            },
          }),
          inject: [ConfigService],
        }),
      ],
      useClass: MongooseService,
      connectionName: CUSTOM_CONNECTION_NAME,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
