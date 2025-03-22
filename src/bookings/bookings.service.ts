import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Booking, BookingDocument } from './schemas/booking.schema'
import { Model } from 'mongoose'
import { BookingRequest } from './requests/booking.request'
import { Product, ProductDocument } from 'src/products/schemas/product.schema'
import {
  BookingListResponse,
  BookingResponse,
} from './responses/booking.reponse'
import { modelMapper } from 'src/utils/mapper.util'

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

  async getAllBookings(): Promise<BookingResponse[]> {
    const bookings = await this.bookingModel.find().populate({
      path: 'product',
      populate: {
        path: 'catagory',
      },
    })

    return modelMapper(BookingListResponse, { data: bookings }).data
  }

  async updateeBookingById(
    bookingId: string,
    updateBookingRequest: BookingRequest,
  ) {
    // const bookings = await this.bookingModel.findByIdAndUpdate(
    //   bookingId,
    //   updateBookingRequest,
    // )
    return updateBookingRequest
  }

  async approveBookingById(
    bookingId: string,
    updateBookingRequest: BookingRequest,
  ) {
    const approve = await this.bookingModel.findByIdAndUpdate(bookingId, {
      $set: { ...updateBookingRequest },
    })
    return approve
  }

  async deleteBookingById(bookingId: string) {
    const booking = await this.bookingModel.findByIdAndDelete(bookingId)
    return booking
  }
}
