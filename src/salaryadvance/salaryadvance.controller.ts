import { Body, Controller, Get, Post } from '@nestjs/common'
import { SalaryadvanceService } from './salaryadvance.service'
import { SalaryAdvanceRequest } from './requests/salaryadvance.requests'
import { SalaryAdvanceResponse } from './responses/salaryadvance.response'

@Controller('salaryadvance')
export class SalaryadvanceController {
  constructor(private readonly salaryadvanceService: SalaryadvanceService) {}

  @Post()
  createSalaryAdvance(
    @Body() createSalalyAdvanceRequest: SalaryAdvanceRequest,
  ) {
    return this.salaryadvanceService.createSalaryAdvance(
      createSalalyAdvanceRequest,
    )
  }

  @Get()
  getAllSalalyAdvances(): Promise<SalaryAdvanceResponse[]> {
    return this.salaryadvanceService.getAllSalalyAdvances()
  }
}
