import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Booking, BookingSchema } from 'src/bookings/schemas/booking.schema'
import { Expense, ExpenseSchema } from 'src/expenses/schemas/expense.schema'
import {
  DocumentCount,
  DocumentCountSchema,
} from 'src/document-count/schemas/document-count.schema'
import { CUSTOM_CONNECTION_NAME } from 'src/utils/constanrs'
import { DashboardController } from './dashboard.controller'
import { DashboardService } from './dashboard.service'

export const DashboardMongoose = MongooseModule.forFeature(
  [
    { name: Booking.name, schema: BookingSchema },
    { name: Expense.name, schema: ExpenseSchema },
    { name: DocumentCount.name, schema: DocumentCountSchema },
  ],
  CUSTOM_CONNECTION_NAME,
)

@Module({
  imports: [DashboardMongoose],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
