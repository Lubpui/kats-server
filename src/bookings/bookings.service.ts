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
import { DeleteStatus } from 'src/shared/enums/delete-status.enum'
import path from 'path'
import { UserResponse } from 'src/users/responses/user.response'
import * as fs from 'fs-extra'
import { deleteFile } from 'src/utils/common.util'

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

  async handleAdjustFile(payload: {
    newFileName: string | undefined
    oldFileName: string | undefined
    dbname: string
  }) {
    const { newFileName, oldFileName, dbname } = payload
    const dirname = path.join(process.env.UPLOAD_PATH ?? '', dbname, 'booking')

    let imageRes: string | undefined = undefined

    if (newFileName !== oldFileName) {
      //ลบไฟล์เดิม
      if (oldFileName && fs.existsSync(path.join(dirname, oldFileName))) {
        await deleteFile(path.join(dirname, oldFileName))
      }

      //สร้างไฟล์
      if (newFileName) {
        const originPath = path.join(process.env.TMP_PATH ?? '', newFileName)
        const destinationPath = path.join(dirname, newFileName)
        if (!fs.existsSync(dirname)) {
          fs.mkdirSync(dirname, { recursive: true })
        }
        await fs.copy(originPath, destinationPath, { overwrite: true })
        imageRes = newFileName
      }
    }

    return imageRes
  }

  async createBooking(
    userInfo: UserResponse,
    createBookingRequest: BookingRequest,
  ) {
    const session = await this.documentCountModel.startSession()
    session.startTransaction()

    try {
      const code = await this.documentCountService.getBookingCode(session)

      const { dbname } = userInfo
      const { slip, productId, image } = createBookingRequest

      //สร้างไฟล์
      if (slip) {
        const dirname = path.join(
          process.env.UPLOAD_PATH ?? '',
          dbname,
          'booking',
        )
        const originPath = path.join(process.env.TMP_PATH ?? '', slip)
        const destinationPath = path.join(dirname, slip)
        if (!fs.existsSync(dirname)) {
          fs.mkdirSync(dirname, { recursive: true })
        }
        await fs.copy(originPath, destinationPath, { overwrite: true })
      }

      if (image) {
        const dirname = path.join(
          process.env.UPLOAD_PATH ?? '',
          dbname,
          'booking',
        )
        const originPath = path.join(process.env.TMP_PATH ?? '', image)
        const destinationPath = path.join(dirname, image)
        if (!fs.existsSync(dirname)) {
          fs.mkdirSync(dirname, { recursive: true })
        }
        await fs.copy(originPath, destinationPath, { overwrite: true })
      }

      const findedProduct = await this.productModel
        .findById(productId)
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

  async getAllBookings(del: number): Promise<BookingResponse[]> {
    const bookingRes = await this.bookingModel
      .find()
      .sort({ createdAt: -1 })
      .populate({
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

    const filterdBookings = bookings.filter(
      (booking) => booking.delete === (del as DeleteStatus),
    )

    filterdBookings.sort((a, b) => {
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

    return filterdBookings
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
        { $sort: { createdAt: -1 } },
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
    userInfo: UserResponse,
    bookingId: string,
    updateBookingRequest: BookingRequest,
  ) {
    const { dbname } = userInfo
    const { slip: newSlip, image: newImage } = updateBookingRequest

    const booking = await this.bookingModel.findById(bookingId, {
      slip: 1,
      image: 1,
    })
    if (!booking) throw new NotFoundException('ไม่พบ booking')

    const { slip: oldSlip, image: oldImage } = booking

    const slipPath = await this.handleAdjustFile({
      newFileName: newSlip,
      oldFileName: oldSlip,
      dbname,
    })

    updateBookingRequest.slip = slipPath

    const imagePath = await this.handleAdjustFile({
      newFileName: newImage,
      oldFileName: oldImage,
      dbname,
    })

    updateBookingRequest.image = imagePath

    const updatedBooking = await this.bookingModel.findByIdAndUpdate(
      bookingId,
      {
        $set: { ...updateBookingRequest },
      },
    )

    return updatedBooking
  }

  async updateGuaranteeByBookingId(
    userInfo: UserResponse,
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

      const updatedBooking = await this.updateBookingById(userInfo, bookingId, {
        ...updateBookingRequest,
        status: bookingStatus,
      })
      return updatedBooking
    } catch (error) {
      throw error
    }
  }

  async approveBookingById(
    userInfo: UserResponse,
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

    const approve = await this.updateBookingById(userInfo, bookingId, {
      ...updateBookingRequest,
      status: bookingStatus,
    })

    return approve
  }

  async cancelBookingById(
    userInfo: UserResponse,
    bookingId: string,
    updateBookingRequest: BookingRequest,
  ) {
    const approve = await this.updateBookingById(userInfo, bookingId, {
      ...updateBookingRequest,
      status: BookingStatus.CANCELED,
    })

    return approve
  }

  async isDeleteBookingById(
    userInfo: UserResponse,
    bookingId: string,
    updateStatusDeleteRequest: BookingRequest,
  ) {
    const updateStatus = await this.updateBookingById(
      userInfo,
      bookingId,
      updateStatusDeleteRequest,
    )

    return updateStatus
  }

  async deleteBookingById(userInfo: UserResponse, bookingId: string) {
    const booking = await this.bookingModel.findById(bookingId)
    if (!booking) throw new NotFoundException('ไม่พบ booking')

    const { slip, image } = booking
    const { dbname } = userInfo
    const dirname = path.join(process.env.UPLOAD_PATH ?? '', dbname, 'booking')

    if (slip && fs.existsSync(path.join(dirname, slip))) {
      await deleteFile(path.join(dirname, slip))
    }

    if (image && fs.existsSync(path.join(dirname, image))) {
      await deleteFile(path.join(dirname, image))
    }

    await this.bookingModel.findByIdAndDelete(bookingId)

    return booking
  }

  async getLastBookingNumber() {
    try {
      const lastBooking = await this.bookingModel
        .findOne()
        .sort({ createdAt: -1 })

      const receiptBookNoStr = lastBooking?.receiptBookNo || '000'
      const numberStr = lastBooking?.number || '0000'

      const receiptBookNoNum = parseInt(receiptBookNoStr, 10)
      const numberNum = parseInt(numberStr, 10)

      let newReceiptBookNoNum = receiptBookNoNum
      const newNumberNum = numberNum + 1

      if (numberNum % 50 === 0) {
        newReceiptBookNoNum = receiptBookNoNum + 1
      }

      const newReceiptBookNo = newReceiptBookNoNum
        .toString()
        .padStart(receiptBookNoStr.length, '0')
      const newNumber = newNumberNum.toString().padStart(numberStr.length, '0')

      const lastBookingNumber = {
        receiptBookNo: newReceiptBookNo,
        number: newNumber,
      }

      return lastBookingNumber
    } catch (error) {
      throw error
    }
  }
}
