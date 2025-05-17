import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Booking, BookingDocument } from './schemas/booking.schema'
import { Model } from 'mongoose'
import { BookingRequest } from './requests/booking.request'
import { Product, ProductDocument } from 'src/products/schemas/product.schema'
import {
  BookingListResponse,
  BookingResponse,
  GuaranteeResponse,
} from './responses/booking.response'
import { modelMapper } from 'src/utils/mapper.util'
import { BookingStatus } from 'src/shared/enums/booking-status.enum'
import { QueryPagination } from 'src/shared/types/queryPagination'
import {
  ProductCatagory,
  ProductCatagoryDocument,
} from 'src/products/schemas/product-catagory.schema'
import { DocumentCountService } from 'src/document-count/document-count.service'
import {
  DocumentCount,
  DocumentCountDocument,
} from 'src/document-count/schemas/document-count.schema'
import {
  TypeProduct,
  TypeProductDocument,
} from 'src/products/schemas/product-typeproduct.schema'
import dayjs from 'dayjs'

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,

    @InjectModel(ProductCatagory.name)
    private catagoryModel: Model<ProductCatagoryDocument>,

    @InjectModel(TypeProduct.name)
    private typeProductModel: Model<TypeProductDocument>,

    @InjectModel(DocumentCount.name)
    private readonly documentCountModel: Model<DocumentCountDocument>,
    private readonly documentCountService: DocumentCountService,
  ) {}

  async createBooking(createBookingRequest: BookingRequest) {
    const session = await this.documentCountModel.startSession()
    session.startTransaction()

    try {
      const code = await this.documentCountService.getExpenseCode(session)

      const findedProduct = await this.productModel.findById(
        createBookingRequest.productId,
      )

      if (!findedProduct) throw new NotFoundException('ไม่พบสินค้า')

      const newCreateBookingRequest = {
        ...createBookingRequest,
        productId: findedProduct._id,
        codeId: code,
      }

      const createdBooking = await new this.bookingModel(
        newCreateBookingRequest,
      ).save()

      await session.commitTransaction()
      return createdBooking
    } catch (error) {
      console.log(error)
      await session.abortTransaction() // rollbackASDF
      throw error
    } finally {
      session.endSession()
    }
  }

  async getAllBookings(): Promise<BookingResponse[]> {
    const bookingRes = await this.bookingModel.find().populate({
      path: 'product',
      populate: [
        {
          path: 'catagory',
        },
        {
          path: 'typeProduct',
        },
      ],
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
              {
                $unwind: {
                  path: '$catagory',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: this.typeProductModel.collection.name,
                  localField: 'typeProductId',
                  foreignField: '_id',
                  as: 'typeProduct',
                },
              },
              {
                $unwind: {
                  path: '$typeProduct',
                  preserveNullAndEmptyArrays: true,
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

  async updateGuaranteeByBookingId(
    bookingId: string,
    updateBookingRequest: BookingRequest,
  ) {
    try {
      const isAllGuaranteesConpleted = updateBookingRequest.guarantees?.every(
        (item) => item.status === BookingStatus.COMPLETED,
      )

      const bookingStatus = isAllGuaranteesConpleted
        ? BookingStatus.COMPLETED
        : BookingStatus.CHECKING

      const updatedBooking = await this.updateBookingById(bookingId, {
        ...updateBookingRequest,
        status: bookingStatus,
      })
      return updatedBooking
    } catch (error) {
      throw error
    }
  }

  async approveBookingById(
    bookingId: string,
    updateBookingRequest: BookingRequest,
  ) {
    if (updateBookingRequest.status === BookingStatus.COMPLETED) {
      const isGuaranteePass = !updateBookingRequest?.guarantees?.length

      if (isGuaranteePass) {
        const initialGuarantee: GuaranteeResponse = {
          serviceNo: 1,
          serviceDate: dayjs(updateBookingRequest.bookDate).toISOString(),
          status: BookingStatus.COMPLETED,
          isBeam: true,
          isWheelArch: true,
          isControlArm: true,
          isChassis: true,
          isUnderbody: true,
        }

        updateBookingRequest.guarantees = [initialGuarantee]
      }
    } else if (updateBookingRequest.status === BookingStatus.CHECKING) {
      const completedGuarantees = updateBookingRequest.guarantees?.filter(
        (item) => item.status === BookingStatus.COMPLETED,
      )

      const currentGuaranteeIndex = completedGuarantees?.length ?? 0

      if (
        updateBookingRequest.guarantees &&
        updateBookingRequest.guarantees[currentGuaranteeIndex]
      ) {
        updateBookingRequest.guarantees[currentGuaranteeIndex].status =
          BookingStatus.COMPLETED
      }
    }

    const isAllGuaranteesConpleted = updateBookingRequest.guarantees?.every(
      (item) => item.status === BookingStatus.COMPLETED,
    )

    const bookingStatus = isAllGuaranteesConpleted
      ? BookingStatus.COMPLETED
      : BookingStatus.CHECKING

    const approve = await this.updateBookingById(bookingId, {
      ...updateBookingRequest,
      status: bookingStatus,
    })

    return approve
  }

  async isDeleteBookingById(
    bookingId: string,
    updateStatusDeleteRequest: BookingRequest,
  ) {
    const updateStatus = await this.updateBookingById(
      bookingId,
      updateStatusDeleteRequest,
    )

    return updateStatus
  }

  async deleteBookingById(bookingId: string) {
    const booking = await this.bookingModel.findByIdAndDelete(bookingId)
    return booking
  }
}
