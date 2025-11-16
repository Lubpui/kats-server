import { Controller, Get, UseGuards, Query } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  getDashboardSummary(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardService.getDashboardSummary(startDate, endDate)
  }

  @Get('bookings-revenue')
  getSuccessfulBookingsRevenue(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardService.getSuccessfulBookingsRevenue(
      startDate,
      endDate,
    )
  }

  @Get('bookings-by-status')
  getBookingsByStatuses(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardService.getBookingsByStatuses(startDate, endDate)
  }

  @Get('expenses-by-category')
  getExpensesByCategory(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardService.getExpensesByCategory(startDate, endDate)
  }
}
