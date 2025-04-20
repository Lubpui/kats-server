import { Controller } from '@nestjs/common'
import { SalaryadvanceService } from './salaryadvance.service'

@Controller('salaryadvance')
export class SalaryadvanceController {
  constructor(private readonly salaryadvanceService: SalaryadvanceService) {}
}
