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

export const ExpenseMongoose = MongooseModule.forFeature([
  { name: Expense.name, schema: ExpenseSchema },
  { name: DocumentCount.name, schema: DocumentCountSchema },
])
@Module({
  imports: [ExpenseMongoose, DocumentCountModule],
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}
