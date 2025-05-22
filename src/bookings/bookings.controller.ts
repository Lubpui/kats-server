import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common'
import { BookingsService } from './bookings.service'
import { BookingRequest } from './requests/booking.request'
import { BookingResponse } from './responses/booking.response'
import { QueryPagination } from 'src/shared/types/queryPagination'

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  createBooking(@Body() createBookingRequest: BookingRequest) {
    return this.bookingsService.createBooking(createBookingRequest)
  }

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

  @Get()
  getAllBookings(): Promise<BookingResponse[]> {
    return this.bookingsService.getAllBookings()
  }

  @Get('pagination')
  getAllBookingPaginations(
    @Query() query: QueryPagination,
  ): Promise<BookingResponse[]> {
    return this.bookingsService.getAllBookingPaginations(query)
  }

  @Get(':bookingId')
  getBookingById(
    @Param('bookingId') bookingId: string,
  ): Promise<BookingResponse> {
    return this.bookingsService.getBookingById(bookingId)
  }

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

  @Delete(':bookingId')
  deleteBookingById(@Param('bookingId') bookingId: string) {
    return this.bookingsService.deleteBookingById(bookingId)
  }
}
