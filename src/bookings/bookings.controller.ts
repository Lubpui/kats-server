import { Controller, Post, Body } from '@nestjs/common'
import { BookingsService } from './bookings.service'
import { BookingRequest } from './requests/booking.request'

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  createBooking(@Body() createBookingRequest: BookingRequest) {
    return this.bookingsService.createBooking(createBookingRequest)
  }

  // @Get()
  // getAllBookings() {
  //   return this.bookingsService.getAllBookings()
  // }
}
