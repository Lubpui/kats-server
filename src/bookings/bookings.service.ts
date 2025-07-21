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
import { CUSTOM_CONNECTION_NAME } from 'src/utils/constanrs'
import { GuaranteeResponse } from './responses/guarantee.response'
import {
  ProductResponse,
  ProductSnapshotResponse,
} from 'src/products/responses/product.response'

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name, CUSTOM_CONNECTION_NAME)
    private bookingModel: Model<BookingDocument>,
    @InjectModel(Product.name, CUSTOM_CONNECTION_NAME)
    private productModel: Model<ProductDocument>,

    @InjectModel(ProductCatagory.name, CUSTOM_CONNECTION_NAME)
    private catagoryModel: Model<ProductCatagoryDocument>,

    @InjectModel(TypeProduct.name, CUSTOM_CONNECTION_NAME)
    private typeProductModel: Model<TypeProductDocument>,

    @InjectModel(DocumentCount.name, CUSTOM_CONNECTION_NAME)
    private readonly documentCountModel: Model<DocumentCountDocument>,
    private readonly documentCountService: DocumentCountService,
  ) {}

  async createBooking(createBookingRequest: BookingRequest) {
    const session = await this.documentCountModel.startSession()
    session.startTransaction()

    try {
      const code = await this.documentCountService.getBookingCode(session)

      const findedProduct = await this.productModel
        .findById(createBookingRequest.productId)
        .populate('catagory')
        .populate('typeProduct') 

      if (!findedProduct) throw new NotFoundException('ไม่พบสินค้า')

      const product = modelMapper(ProductResponse, findedProduct)
      const {
        catagory: _catagory,
        typeProduct: _typeProduct,
        ...productSnapshot
      }: ProductSnapshotResponse = {
        ...product,
        catagorySnapshot: product.catagory,
        typeProductSnapshot: product.typeProduct,
      }

      console.log(productSnapshot)

      const newCreateBookingRequest = {
        ...createBookingRequest,
        product: productSnapshot,
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
      const bookingRes = await this.bookingModel.findById(bookingId)

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
          serviceTime: updateBookingRequest.bookTime,
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

  async cancelBookingById(
    bookingId: string,
    updateBookingRequest: BookingRequest,
  ) {
    const approve = await this.updateBookingById(bookingId, {
      ...updateBookingRequest,
      status: BookingStatus.CANCELED,
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
