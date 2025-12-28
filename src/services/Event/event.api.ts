import apiClient from "../interceptor";
import type { EventProps, UpdateEventPayload } from "./event.types";

export const EventAPI = {
  getEvents: async (): Promise<EventProps[]> => {
    const result = await apiClient.get("api/event/get");
    if (!result) throw Error("Some issue");
    return result.data;
  },
  createEvent: async (payload: EventProps): Promise<EventProps> => {
    const result = await apiClient.post("api/event/create", { ...payload });
    return result.data;
  },
  deleteEvent: async ({ id }: { id: string }): Promise<EventProps> => {
    //@ts-expect-error expected
    const result = await apiClient.delete("api/event/delete", { id: id });
    return result.data;
  },
  updateEvent: async (payload: UpdateEventPayload): Promise<EventProps> => {
    const result = await apiClient.patch("api/event/update", { ...payload });
    return result.data;
  },
};
