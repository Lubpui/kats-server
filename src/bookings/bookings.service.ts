import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Booking, BookingDocument } from './schemas/booking.schema'
import { Model } from 'mongoose'
import { BookingRequest } from './requests/booking.request'
import { Product, ProductDocument } from 'src/products/schemas/product.schema'

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async createBooking(createBookingRequest: BookingRequest) {
    try {
      const findedProduct = await this.productModel.findById(
        createBookingRequest.product,
      )

      if (!findedProduct) throw new NotFoundException('ไม่พบสินค้า')

      const newCreateBookingRequest = {
        ...createBookingRequest,
        product: findedProduct._id,
      }

      const createdBooking = await new this.bookingModel(
        newCreateBookingRequest,
      ).save()

      return createdBooking
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
