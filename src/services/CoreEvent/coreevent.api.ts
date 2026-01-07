import apiClient from "../interceptor";
import type { CoreEventProps, UpdateCoreEventPayload } from "./coreevent.types";

export const CoreEventAPI = {
  getCoreEvents: async (): Promise<CoreEventProps[]> => {
    const result = await apiClient.get("api/coreevent/get");
    if (!result) throw Error("Some issue");
    return result.data;
  },
  createCoreEvent: async (payload: CoreEventProps): Promise<CoreEventProps> => {
    const result = await apiClient.post("api/coreevent/create", { ...payload });
    return result.data;
  },
  deleteCoreEvent: async ({
    type,
  }: {
    type: string;
  }): Promise<CoreEventProps> => {
    //@ts-expect-error expected
    const result = await apiClient.delete("api/coreevent/delete", { type });
    return result.data;
  },
  updateCoreEvent: async (
    payload: UpdateCoreEventPayload
  ): Promise<CoreEventProps> => {
    const result = await apiClient.patch("api/coreevent/update", {
      ...payload,
    });
    return result.data;
  },
};
