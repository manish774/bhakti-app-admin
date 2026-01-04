import { TempleAPI } from "./temple.api";
import type { Temple } from "../../types/api";

export class TempleController {
  private static instance: TempleController;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new TempleController();
    }
    return this.instance;
  }

  async getTemples(): Promise<Temple[]> {
    return TempleAPI.getTemples();
  }

  async getByIds({ ids }: { ids: string[] }): Promise<Temple[]> {
    return TempleAPI.getByIds(ids);
  }

  async createTemple(
    payload: Omit<Temple, "_id" | "createdAt" | "updatedAt" | "__v">
  ): Promise<Temple> {
    return TempleAPI.createTemple(payload);
  }

  async updateTemple(id: string, payload: Partial<Temple>): Promise<Temple> {
    return TempleAPI.updateTemple(id, payload);
  }

  async deleteTemple(id: string): Promise<{ success: boolean }> {
    return TempleAPI.deleteTemple(id);
  }

  async addPackage(templeId: string, payload: any) {
    return TempleAPI.addPackage(templeId, payload);
  }

  async deletePackage(templeId: string, packageId: string) {
    return TempleAPI.deletePackage(templeId, packageId);
  }

  async addImage(file: File, templeId?: string) {
    return TempleAPI.addImage(file, templeId);
  }
}
