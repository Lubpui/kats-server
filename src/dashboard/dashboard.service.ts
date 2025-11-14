import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Booking, BookingDocument } from 'src/bookings/schemas/booking.schema'
import { Expense, ExpenseDocument } from 'src/expenses/schemas/expense.schema'
import { Model } from 'mongoose'
import { CUSTOM_CONNECTION_NAME } from 'src/utils/constanrs'
import { BookingStatus } from 'src/shared/enums/booking-status.enum'
import { CategoryType, ExpenseStatus } from 'src/shared/enums/expense.enum'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Booking.name, CUSTOM_CONNECTION_NAME)
    private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Expense.name, CUSTOM_CONNECTION_NAME)
    private readonly expenseModel: Model<ExpenseDocument>,
  ) {}

  /**
   * ดึงข้อมูล booking ที่ status เป็น COMPLETED เท่านั้นแล้วรวมรายได้
   */
  async getSuccessfulBookingsRevenue(
    startDate?: string,
    endDate?: string,
  ): Promise<{
    totalRevenue: number
    bookingCount: number
    averageRevenue: number
  }> {
    // ถ้าไม่ส่ง startDate และ endDate มาให้เอาของทั้งปีปัจจุบัน
    const start = startDate
      ? dayjs(startDate).startOf('date').toDate()
      : dayjs().startOf('year').toDate()
    const end = endDate
      ? dayjs(endDate).endOf('date').toDate()
      : dayjs().endOf('year').toDate()

    const bookings = await this.bookingModel
      .find({
        status: BookingStatus.COMPLETED,
        delete: 0,
        $expr: {
          $and: [
            {
              $gte: [{ $toDate: '$bookDate' }, start],
            },
            {
              $lte: [{ $toDate: '$bookDate' }, end],
            },
          ],
        },
      })
      .exec()

    const totalRevenue = bookings.reduce((sum, booking) => {
      return sum + (booking.price?.amount || 0)
    }, 0)

    return {
      totalRevenue,
      bookingCount: bookings.length,
      averageRevenue: bookings.length > 0 ? totalRevenue / bookings.length : 0,
    }
  }

  /**
   * ดึงข้อมูล expense แล้วแยกหมวดหมู่ตาม CategoryType
   * คืนค่า object พร้อม total
   */
  async getExpensesByCategory(
    startDate?: string,
    endDate?: string,
  ): Promise<{
    [key: string]: number
    total: number
  }> {
    // ถ้าไม่ส่ง startDate และ endDate มาให้เอาของทั้งปีปัจจุบัน
    const start = startDate
      ? dayjs(startDate).startOf('date').toDate()
      : dayjs().startOf('year').toDate()
    const end = endDate
      ? dayjs(endDate).endOf('date').toDate()
      : dayjs().endOf('year').toDate()

    console.log(start)
    console.log(end)

    const expenses = await this.expenseModel
      .find({
        status: ExpenseStatus.APPROVE,
        delete: 0,
        $expr: {
          $and: [
            {
              $gte: [{ $toDate: '$datePrice' }, start],
            },
            {
              $lte: [{ $toDate: '$datePrice' }, end],
            },
          ],
        },
      })
      .exec()

    // สร้าง object สำหรับเก็บผลรวมของแต่ละ category
    const categoryTotals: { [key: string]: number } = {}

    // ตั้งค่าเริ่มต้นสำหรับทุก category type
    Object.entries(CategoryType).forEach(([key, value]) => {
      if (typeof value === 'number') {
        categoryTotals[key] = 0
      }
    })

    console.log(expenses)

    // วนลูปข้อมูล expenses แล้วรวมตามหมวดหมู่
    expenses.forEach((expense) => {
      if (expense.categorys && Array.isArray(expense.categorys)) {
        expense.categorys.forEach((category) => {
          const categoryKey = Object.keys(CategoryType).find(
            (key) =>
              CategoryType[key as keyof typeof CategoryType] === category.type,
          )

          if (categoryKey) {
            categoryTotals[categoryKey] =
              (categoryTotals[categoryKey] || 0) + category.amount
          }
        })
      }
    })

    // คำนวณ total
    const total = Object.values(categoryTotals).reduce(
      (sum, value) => sum + value,
      0,
    )

    return {
      ...categoryTotals,
      total,
    }
  }

  /**
   * ดึงข้อมูลสรุป dashboard ทั้งหมด
   */
  async getDashboardSummary(startDate?: string, endDate?: string) {
    const bookingsRevenue = await this.getSuccessfulBookingsRevenue(
      startDate,
      endDate,
    )
    const expensesByCategory = await this.getExpensesByCategory(
      startDate,
      endDate,
    )

    return {
      bookingsRevenue,
      expensesByCategory,
      netProfit: bookingsRevenue.totalRevenue - expensesByCategory.total,
    }
  }
}
