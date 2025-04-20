import { Injectable } from '@nestjs/common'
import {
  SalaryAdvance,
  SalaryAdvanceDocument,
} from './schemas/salaryadvance.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
  SalaryAdvanceListResponse,
  SalaryAdvanceResponse,
} from './responses/salaryadvance.response'
import { SalaryAdvanceRequest } from './requests/salaryadvance.requests'
import { modelMapper } from 'src/utils/mapper.util'

@Injectable()
export class SalaryadvanceService {
  constructor(
    @InjectModel(SalaryAdvance.name)
    private readonly SalaryAdvanceModel: Model<SalaryAdvanceDocument>,
  ) {}

  async createSalaryAdvance(
    createSalalyAdvanceRequest: SalaryAdvanceRequest,
  ): Promise<SalaryAdvanceResponse> {
    try {
      const createdSalalyAdvance = await new this.SalaryAdvanceModel(
        createSalalyAdvanceRequest,
      ).save()

      return modelMapper(SalaryAdvanceResponse, createdSalalyAdvance)
    } catch (error) {
      throw error
    }
  }

  async getAllSalalyAdvances(): Promise<SalaryAdvanceResponse[]> {
    const salalyAdvances = await this.SalaryAdvanceModel.find()
    return modelMapper(SalaryAdvanceListResponse, { data: salalyAdvances }).data
  }
}
