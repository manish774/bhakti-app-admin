import apiClient from "../interceptor";
import type { IPandit } from "./pandit.types";

export const PanditAPI = {
  getPandit: async (): Promise<IPandit[]> => {
    const result = await apiClient.get("api/pandit/get");
    if (!result) throw Error("Some issue");
    return result.data;
  },
  getByIds: async ({ ids }: { ids: string[] }): Promise<IPandit[]> => {
    const result = await apiClient.post("api/pandit/getByIds", { ids });
    if (!result) throw Error("Some issue");
    return result.data;
  },
  createPandit: async (payload: IPandit): Promise<IPandit> => {
    const result = await apiClient.post("api/pandit/create", { ...payload });
    return result.data;
  },
  deletePandit: async ({ id }: { id: string }): Promise<IPandit> => {
    //@ts-expect-error expected
    const result = await apiClient.delete("api/pandit/create", { id: id });
    return result.data;
  },
  updatePandit: async (payload: IPandit): Promise<IPandit> => {
    const result = await apiClient.patch("api/pandit/update", { ...payload });
    return result.data;
  },
};
