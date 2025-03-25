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
import { BookingStatus } from 'src/shared/enums/booking-status.enum'

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
    const bookingRes = await this.bookingModel.find().populate({
      path: 'product',
      populate: {
        path: 'catagory',
      },
    })

    const bookings = modelMapper(BookingListResponse, { data: bookingRes }).data

    bookings.sort((a, b) => {
      if (
        a.status === BookingStatus.COMPLETED &&
        b.status !== BookingStatus.COMPLETED
      ) {
        return 1
      }

      if (
        a.status !== BookingStatus.COMPLETED &&
        b.status === BookingStatus.COMPLETED
      ) {
        return -1
      }

      return 0
    })

    return bookings
  }

  async getBookingById(bookingId: string): Promise<BookingResponse> {
    try {
      const bookingRes = await this.bookingModel
        .findById(bookingId)
        .populate({ path: 'product', populate: 'catagory' })

      return modelMapper(BookingResponse, bookingRes)
    } catch (error) {
      throw error
    }
  }

  async updateBookingById(
    bookingId: string,
    updateBookingRequest: BookingRequest,
  ) {
    const booking = await this.bookingModel.findByIdAndUpdate(bookingId, {
      $set: { ...updateBookingRequest },
    })
    return booking
  }

  async approveBookingById(
    bookingId: string,
    updateBookingRequest: BookingRequest,
  ) {
    const approve = await this.updateBookingById(
      bookingId,
      updateBookingRequest,
    )

    return approve
  }

  async deleteBookingById(bookingId: string) {
    const booking = await this.bookingModel.findByIdAndDelete(bookingId)
    return booking
  }
}
