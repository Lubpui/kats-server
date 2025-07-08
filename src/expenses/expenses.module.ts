import { Module } from '@nestjs/common'
import { ExpensesService } from './expenses.service'
import { ExpensesController } from './expenses.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Expense, ExpenseSchema } from './schemas/expense.schema'
import { DocumentCountModule } from 'src/document-count/document-count.module'
import {
  DocumentCount,
  DocumentCountSchema,
} from 'src/document-count/schemas/document-count.schema'
import { CUSTOM_CONNECTION_NAME } from 'src/utils/constanrs'

export const ExpenseMongoose = MongooseModule.forFeature(
  [
    { name: Expense.name, schema: ExpenseSchema },
    { name: DocumentCount.name, schema: DocumentCountSchema },
  ],
  CUSTOM_CONNECTION_NAME,
)
@Module({
  imports: [ExpenseMongoose, DocumentCountModule],
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}
