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

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createBooking(@Body() createBookingRequest: BookingRequest) {
    return this.bookingsService.createBooking(createBookingRequest)
  }

  @UseGuards(JwtAuthGuard)
  @Post('approve/:bookingId')
  approveBookingById(
    @Param('bookingId') bookingId: string,
    @Body() updateBookingRequest: BookingRequest,
  ) {
    return this.bookingsService.approveBookingById(
      bookingId,
      updateBookingRequest,
    )
  }

  @UseGuards(JwtAuthGuard)
  @Post('cancel/:bookingId')
  cancelBookingById(
    @Param('bookingId') bookingId: string,
    @Body() updateBookingRequest: BookingRequest,
  ) {
    return this.bookingsService.cancelBookingById(
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
    @Param('bookingId') bookingId: string,
    @Body() updateBookingRequest: BookingRequest,
  ) {
    return this.bookingsService.updateBookingById(
      bookingId,
      updateBookingRequest,
    )
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateGuarantee/:bookingId')
  updateGuaranteeByBookingId(
    @Param('bookingId') bookingId: string,
    @Body() updateBookingRequest: BookingRequest,
  ) {
    return this.bookingsService.updateGuaranteeByBookingId(
      bookingId,
      updateBookingRequest,
    )
  }

  @UseGuards(JwtAuthGuard)
  @Post('selectDelete/:bookingId')
  isDeleteBookingById(
    @Param('bookingId') bookingId: string,
    @Body() updateStatusDeleteRequest: BookingRequest,
  ) {
    return this.bookingsService.isDeleteBookingById(
      bookingId,
      updateStatusDeleteRequest,
    )
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':bookingId')
  deleteBookingById(@Param('bookingId') bookingId: string) {
    return this.bookingsService.deleteBookingById(bookingId)
  }
}
