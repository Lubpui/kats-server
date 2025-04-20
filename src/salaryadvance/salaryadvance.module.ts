import { Module } from '@nestjs/common'
import { SalaryadvanceService } from './salaryadvance.service'
import { SalaryadvanceController } from './salaryadvance.controller'
import { MongooseModule } from '@nestjs/mongoose'
import {
  SalaryAdvance,
  SalaryAdvanceSchema,
} from './schemas/salaryadvance.schema'

export const SalaryadvanceMongoose = MongooseModule.forFeature([
  { name: SalaryAdvance.name, schema: SalaryAdvanceSchema },
])
@Module({
  imports: [SalaryadvanceMongoose],
  controllers: [SalaryadvanceController],
  providers: [SalaryadvanceService],
  exports: [SalaryadvanceService],
})
export class SalaryadvanceModule {}
