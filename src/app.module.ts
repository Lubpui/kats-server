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
import { loadJwtKeys } from './utils/jwt-keys.util'
import { ThrottlerModule } from '@nestjs/throttler'

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
    // ตัว ThrottlerModule เป็น global อยู่แล้ว แต่ยังไม่ได้ผูก guard ไว้ทั้งระบบ
    // ตอนนี้ใช้เฉพาะ /auth/login ที่เป็นเป้า brute force
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      },
    ]),
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
            ...loadJwtKeys(configService),
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
    CoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
