import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Booking, BookingDocument } from './schemas/booking.schema'
import { Model } from 'mongoose'
import { BookingRequest } from './requests/booking.request'
import { Product, ProductDocument } from 'src/products/schemas/product.schema'
import {
  BookingListResponse,
  BookingResponse,
} from './responses/booking.response'
import { modelMapper } from 'src/utils/mapper.util'
import { BookingStatus } from 'src/shared/enums/booking-status.enum'
import { QueryPagination } from 'src/shared/types/queryPagination'
import {
  ProductCatagory,
  ProductCatagoryDocument,
} from 'src/products/schemas/product-catagory.schema'

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(ProductCatagory.name)
    private catagoryModel: Model<ProductCatagoryDocument>,
  ) {}

  async createBooking(createBookingRequest: BookingRequest) {
    try {
      const findedProduct = await this.productModel.findById(
        createBookingRequest.productId,
      )

      if (!findedProduct) throw new NotFoundException('ไม่พบสินค้า')

      const newCreateBookingRequest = {
        ...createBookingRequest,
        productId: findedProduct._id,
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

  async getAllBookingPaginations(
    query: QueryPagination,
  ): Promise<BookingResponse[]> {
    try {
      const { term, receiptBookNo, productName } = query

      const receiptBookNoPipline =
        receiptBookNo !== 'all'
          ? [
              {
                $match: {
                  receiptBookNo: receiptBookNo,
                },
              },
            ]
          : []

      const productNamePipline =
        productName && productName !== 'all'
          ? [
              {
                $match: {
                  'product.name': productName,
                },
              },
            ]
          : []

      const bookingRes = await this.bookingModel.aggregate([
        ...receiptBookNoPipline,
        {
          $match: {
            $or: [
              { name: { $regex: term, $options: 'i' } },
              { number: { $regex: term, $options: 'i' } },
              { tel: { $regex: term, $options: 'i' } },
            ],
          },
        },
        {
          $lookup: {
            from: this.productModel.collection.name,
            localField: 'productId',
            foreignField: '_id',
            as: 'product',
            pipeline: [
              {
                $lookup: {
                  from: this.catagoryModel.collection.name,
                  localField: 'catagoryId',
                  foreignField: '_id',
                  as: 'catagory',
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: '$product',
            preserveNullAndEmptyArrays: true,
          },
        },
        ...productNamePipline,
      ])

      const bookings = modelMapper(BookingListResponse, {
        data: bookingRes,
      }).data

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
    } catch (error) {
      throw error
    }
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
