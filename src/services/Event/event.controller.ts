import { EventAPI } from "./event.api";
import type { EventProps } from "./event.types";

export interface IEventController {
  getEvents(): Promise<EventProps[]>;
  updateEvent(payload: EventProps): Promise<EventProps>;
  deleteEvent(params: { id: string }): Promise<EventProps>;
  createEvent(payload: EventProps): Promise<EventProps>;
}

export class EventController implements IEventController {
  private static instance: EventController;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new EventController();
    }
    return this.instance;
  }

  async getEvents(): Promise<EventProps[]> {
    return EventAPI.getEvents();
  }

  async updateEvent(payload: EventProps): Promise<EventProps> {
    return EventAPI.updateEvent(payload);
  }

  async deleteEvent({ id }: { id: string }): Promise<EventProps> {
    return EventAPI.deleteEvent({ id });
  }

  async createEvent(payload: EventProps): Promise<EventProps> {
    return EventAPI.createEvent(payload);
  }
}
