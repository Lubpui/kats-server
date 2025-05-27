import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ProductsModule } from './products/products.module'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EmployeesModule } from './employees/employees.module'
import { BookingsModule } from './bookings/bookings.module'
import { ExpensesModule } from './expenses/expenses.module'
import { DocumentCountModule } from './document-count/document-count.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
    EmployeesModule,
    BookingsModule,
    ExpensesModule,
    DocumentCountModule,
    PermissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
