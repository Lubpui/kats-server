import { Module } from '@nestjs/common'
import { SalaryadvanceService } from './salaryadvance.service'
import { SalaryadvanceController } from './salaryadvance.controller'

@Module({
  imports: [],
  controllers: [SalaryadvanceController],
  providers: [SalaryadvanceService],
  exports: [SalaryadvanceService],
})
export class SalaryadvanceModule {}
