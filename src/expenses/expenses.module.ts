import { Module } from '@nestjs/common'
import { ExpensesService } from './expenses.service'
import { ExpensesController } from './expenses.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Expense, ExpenseSchema } from './schemas/expense.schema'

export const ExpenseMongoose = MongooseModule.forFeature([
  { name: Expense.name, schema: ExpenseSchema },
])
@Module({
  imports: [ExpenseMongoose],
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}
