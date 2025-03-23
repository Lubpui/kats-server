import { Controller, Post, Body, Get, Put, Param, Delete } from '@nestjs/common'
import { BookingsService } from './bookings.service'
import { BookingRequest } from './requests/booking.request'
import { BookingResponse } from './responses/booking.reponse'

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

  @Get()
  getAllBookings(): Promise<BookingResponse[]> {
    return this.bookingsService.getAllBookings()
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
    return this.bookingsService.updateeBookingById(
      bookingId,
      updateBookingRequest,
    )
  }

  @Delete(':bookingId')
  deleteBookingById(@Param('bookingId') bookingId: string) {
    return this.bookingsService.deleteBookingById(bookingId)
  }
}
