import { Module } from '@nestjs/common'
import { BookingsService } from './bookings.service'
import { BookingsController } from './bookings.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Product, ProductSchema } from 'src/products/schemas/product.schema'
import { Booking, BookingSchema } from './schemas/booking.schema'

export const ProductsMongoose = MongooseModule.forFeature([
  { name: Product.name, schema: ProductSchema },
  { name: Booking.name, schema: BookingSchema },
])

@Module({
  imports: [ProductsMongoose],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
