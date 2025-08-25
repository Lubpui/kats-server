import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common'
import { BookingsService } from './bookings.service'
import { BookingRequest } from './requests/booking.request'
import { BookingResponse } from './responses/booking.response'
import { QueryPagination } from 'src/shared/types/queryPagination'
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard'
import { UserInfo } from 'src/shared/decorators/user-info.decorator'
import { UserResponse } from 'src/users/responses/user.response'

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createBooking(
    @Body() createBookingRequest: BookingRequest,
    @UserInfo() userInfo: UserResponse,
  ) {
    return this.bookingsService.createBooking(userInfo, createBookingRequest)
  }

  @UseGuards(JwtAuthGuard)
  @Post('approve/:bookingId')
  approveBookingById(
    @UserInfo() userInfo: UserResponse,
    @Param('bookingId') bookingId: string,
    @Body() updateBookingRequest: BookingRequest,
  ) {
    return this.bookingsService.approveBookingById(
      userInfo,
      bookingId,
      updateBookingRequest,
    )
  }

  @UseGuards(JwtAuthGuard)
  @Post('cancel/:bookingId')
  cancelBookingById(
    @UserInfo() userInfo: UserResponse,
    @Param('bookingId') bookingId: string,
    @Body() updateBookingRequest: BookingRequest,
  ) {
    return this.bookingsService.cancelBookingById(
      userInfo,
      bookingId,
      updateBookingRequest,
    )
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllBookings(@Query('delete') del: string): Promise<BookingResponse[]> {
    return this.bookingsService.getAllBookings(Number(del))
  }

  @Get('preview')
  getAllBookingsForPreview(
    @Query('delete') del: string,
  ): Promise<BookingResponse[]> {
    return this.bookingsService.getAllBookings(Number(del))
  }

  @UseGuards(JwtAuthGuard)
  @Get('pagination')
  getAllBookingPaginations(
    @Query() query: QueryPagination,
  ): Promise<BookingResponse[]> {
    return this.bookingsService.getAllBookingPaginations(query)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':bookingId')
  getBookingById(
    @Param('bookingId') bookingId: string,
  ): Promise<BookingResponse> {
    return this.bookingsService.getBookingById(bookingId)
  }

  @UseGuards(JwtAuthGuard)
  @Put(':bookingId')
  updateeBookingById(
    @UserInfo() userInfo: UserResponse,
    @Param('bookingId') bookingId: string,
    @Body() updateBookingRequest: BookingRequest,
  ) {
    return this.bookingsService.updateBookingById(
      userInfo,
      bookingId,
      updateBookingRequest,
    )
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateGuarantee/:bookingId')
  updateGuaranteeByBookingId(
    @UserInfo() userInfo: UserResponse,
    @Param('bookingId') bookingId: string,
    @Body() updateBookingRequest: BookingRequest,
  ) {
    return this.bookingsService.updateGuaranteeByBookingId(
      userInfo,
      bookingId,
      updateBookingRequest,
    )
  }

  @UseGuards(JwtAuthGuard)
  @Post('selectDelete/:bookingId')
  isDeleteBookingById(
    @UserInfo() userInfo: UserResponse,
    @Param('bookingId') bookingId: string,
    @Body() updateStatusDeleteRequest: BookingRequest,
  ) {
    return this.bookingsService.isDeleteBookingById(
      userInfo,
      bookingId,
      updateStatusDeleteRequest,
    )
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':bookingId')
  deleteBookingById(
    @UserInfo() userInfo: UserResponse,
    @Param('bookingId') bookingId: string,
  ) {
    return this.bookingsService.deleteBookingById(userInfo, bookingId)
  }
}
