import apiClient from "../interceptor";
import type { BookingProps, UpdateBookingPayload } from "./bookings.types";

export const BookingAPI = {
  getBookings: async (): Promise<BookingProps[]> => {
    const result = await apiClient.get("api/booking/get");
    if (!result) throw Error("Some issue");
    return result.data;
  },
  getByIds: async ({ ids }: { ids: string[] }): Promise<BookingProps[]> => {
    const result = await apiClient.post("api/booking/getByIds", { ids });
    if (!result) throw Error("Some issue");
    return result.data;
  },
  createBooking: async (payload: BookingProps): Promise<BookingProps> => {
    const result = await apiClient.post("api/booking/create", { ...payload });
    return result.data;
  },
  deleteBooking: async ({ id }: { id: string }): Promise<BookingProps> => {
    //@ts-expect-error expected
    const result = await apiClient.delete("api/booking/create", { id: id });
    return result.data;
  },
  updateBooking: async (
    payload: UpdateBookingPayload
  ): Promise<BookingProps> => {
    const result = await apiClient.patch("api/booking/update", { ...payload });
    return result.data;
  },
};
