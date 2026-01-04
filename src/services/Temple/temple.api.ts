import apiClient from "../interceptor";
import Services from "../Services";
import type { Temple } from "../../types/api";

const service = Services.getInstance();

export const TempleAPI = {
  getTemples: async (): Promise<Temple[]> => {
    const resp = await service.getAllTemples();
    return resp;
  },

  getByIds: async (ids: string[]): Promise<Temple[]> => {
    const response = await apiClient.post("/api/admin/temples/getByIds", {
      ids,
    });
    return response.data;
  },

  createTemple: async (
    payload: Omit<Temple, "_id" | "createdAt" | "updatedAt" | "__v">
  ): Promise<Temple> => {
    return service.addTemple(payload as any);
  },

  updateTemple: async (
    id: string,
    payload: Partial<Temple>
  ): Promise<Temple> => {
    return service.updateTemple(id, payload);
  },

  deleteTemple: async (id: string): Promise<{ success: boolean }> => {
    return service.deleteTemple(id);
  },

  addPackage: async (templeId: string, payload: any) => {
    return service.addPackage(templeId, payload);
  },

  deletePackage: async (templeId: string, packageId: string) => {
    return service.deletePackage(templeId, packageId);
  },

  addImage: async (file: File, templeId?: string) => {
    return service.addImage(file, templeId);
  },
};
