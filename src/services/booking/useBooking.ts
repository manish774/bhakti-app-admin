import { useCallback, useEffect, useState } from "react";
import { BookingController } from "./booking.controller";
import type { BookingProps } from "./bookings.types";

interface UseBookingsState {
  bookings: BookingProps[];
  loading: boolean;
  error: string | null;
}

interface UseBookingsReturn extends UseBookingsState {
  refetch: () => Promise<void>;
  fetchBookings: () => Promise<void>;
  fetchBookingByIDs: (ids: string[]) => Promise<BookingProps[]>;
  createBooking: (payload: BookingProps) => Promise<BookingProps | null>;
  updateBooking: (payload: BookingProps) => Promise<BookingProps | null>;
  deleteBooking: ({ id }: { id: string }) => Promise<BookingProps | null>;
}

export const useBooking = ({
  autoFetch = true,
}: {
  autoFetch: boolean;
}): UseBookingsReturn => {
  const [state, setState] = useState<UseBookingsState>({
    bookings: [],
    loading: autoFetch,
    error: null,
  });

  const controller = BookingController.getInstance();

  const fetchBookings = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const data = await controller.getBookings();
      console.log(data);
      setState((prev) => ({
        ...prev,
        loading: false,
        //@ts-expect-error expected
        bookings: data.data.data,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        bookings: [],
        loading: false,
        error: err instanceof Error ? err.message : "Failed to fetch bookings",
      }));
    }
  }, [controller]);

  const createBooking = useCallback(
    async (payload: BookingProps): Promise<BookingProps> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const createdBooking = await controller.createBooking(payload);
        setState((prev) => ({ ...prev, loading: false }));
        return createdBooking;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            err instanceof Error ? err.message : "Failed to create booking",
        }));
      }
    },
    [controller]
  );

  const deleteBooking = useCallback(
    async ({ id }: { id: string }): Promise<BookingProps> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const deletedBooking = await controller.deleteBooking({ id });
        setState((prev) => ({ ...prev, loading: false }));
        return deletedBooking;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            err instanceof Error ? err.message : "Failed to delete booking",
        }));
      }
    },
    [controller]
  );

  const updateBooking = useCallback(
    async (payload: BookingProps): Promise<BookingProps> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const updatedBooking = await controller.updateBooking(payload);
        setState((prev) => ({ ...prev, loading: false }));
        return updatedBooking;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            err instanceof Error ? err.message : "Failed to update booking",
        }));
      }
    },
    [controller]
  );

  const fetchBookingByIDs = useCallback(
    async (ids: string[]): Promise<BookingProps[]> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const data = await controller.getByIds({ ids });
        console.log(data);
        setState((prev) => ({
          ...prev,
          loading: false,
          //@ts-expect-error expected
          bookings: data.data,
        }));
        //@ts-expect-error expected
        return data.data;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          bookings: [],
          loading: false,
          error:
            err instanceof Error ? err.message : "Failed to fetch bookings",
        }));
      }
    },
    [controller]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchBookings();
    }
  }, [autoFetch, fetchBookings]);

  return {
    ...state,
    fetchBookingByIDs,
    refetch: fetchBookings,
    createBooking,
    fetchBookings,
    deleteBooking,
    updateBooking,
  };
};
