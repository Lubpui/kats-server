import { Controller, Post, Body, Get } from '@nestjs/common'
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

  @Get()
  getAllBookings(): Promise<BookingResponse[]> {
    return this.bookingsService.getAllBookings()
  }
}
