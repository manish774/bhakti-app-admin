import { BookingAPI } from "./booking.api";
import type { BookingProps } from "./bookings.types";

export class BookingController {
  private static instance: BookingController;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new BookingController();
    }
    return this.instance;
  }

  async getBookings(): Promise<BookingProps[]> {
    return BookingAPI.getBookings();
  }

  async updateBooking(payload: BookingProps): Promise<BookingProps> {
    return BookingAPI.updateBooking(payload);
  }

  async deleteBooking({ id }: { id: string }): Promise<BookingProps> {
    return BookingAPI.deleteBooking({ id });
  }

  async createBooking(payload: BookingProps): Promise<BookingProps> {
    return BookingAPI.createBooking(payload);
  }

  async getByIds({ ids }: { ids: string[] }): Promise<BookingProps[]> {
    return BookingAPI.getByIds({ ids });
  }
}
