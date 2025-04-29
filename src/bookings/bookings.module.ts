import { Module } from '@nestjs/common'
import { BookingsService } from './bookings.service'
import { BookingsController } from './bookings.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Product, ProductSchema } from 'src/products/schemas/product.schema'
import { Booking, BookingSchema } from './schemas/booking.schema'
import {
  ProductCatagory,
  ProductCatagorySchema,
} from 'src/products/schemas/product-catagory.schema'
import {
  DocumentCount,
  DocumentCountSchema,
} from 'src/document-count/schemas/document-count.schema'
import { DocumentCountModule } from 'src/document-count/document-count.module'

export const ProductsMongoose = MongooseModule.forFeature([
  { name: Product.name, schema: ProductSchema },
  { name: ProductCatagory.name, schema: ProductCatagorySchema },
  { name: Booking.name, schema: BookingSchema },
  { name: DocumentCount.name, schema: DocumentCountSchema },
])

@Module({
  imports: [ProductsMongoose, DocumentCountModule],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
