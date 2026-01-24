import { BookingController } from "../../services/booking/booking.controller";
import { EventController } from "../../services/Event/event.controller";

export type IServiceManager = {
  bookingController: BookingController;
  eventController: EventController;
};
export const ServicesManager = (): IServiceManager => {
  const bookingController = BookingController.getInstance();
  const eventController = EventController.getInstance();

  return { bookingController, eventController };
};
