import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import {
  DocumentCount,
  DocumentCountDocument,
} from './schemas/document-count.schema'
import { ClientSession, Model } from 'mongoose'
import { DocumentCountRequest } from './requsets/document-count.requset'
import { DocumentCountResponse } from './responses/document-count.response'
import { modelMapper } from 'src/utils/mapper.util'

@Injectable()
export class DocumentCountService {
  constructor(
    @InjectModel(DocumentCount.name)
    private readonly documentCountModel: Model<DocumentCountDocument>,
  ) {}

  async createDocumentCount(
    createDocumentCount: DocumentCountRequest,
  ): Promise<DocumentCountResponse> {
    const createdCount = await new this.documentCountModel(
      createDocumentCount,
    ).save()
    return modelMapper(DocumentCountResponse, createdCount)
  }

  async getExpenseCode(session: ClientSession) {
    const documentCount = await this.documentCountModel.findOneAndUpdate(
      {},
      { $inc: { expenseCount: 1 } },
      { new: true, session },
    )
    if (!documentCount) throw new NotFoundException('ไม่พบ documentCount')

    const { expenseCount = 0 } = modelMapper(
      DocumentCountResponse,
      documentCount,
    )

    const expenseCode = `EXC${String(expenseCount).padStart(3, '0')}`

    return expenseCode
  }

  async getBookingCode() {
    const documentCount = await this.documentCountModel.findOneAndUpdate(
      {},
      { $inc: { bookingCount: 1 } },
      { new: true },
    )
    if (!documentCount) throw new NotFoundException('ไม่พบ documentCount')

    const { bookingCount = 0 } = modelMapper(
      DocumentCountResponse,
      documentCount,
    )

    const bookingCode = `BKC${String(bookingCount).padStart(3, '0')}`

    return bookingCode
  }
}
