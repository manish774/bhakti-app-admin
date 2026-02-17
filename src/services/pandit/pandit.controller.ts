import { PanditAPI } from "./pandit.api";
import type { IPandit } from "./pandit.types";

export class PanditController {
  private static instance: PanditController;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new PanditController();
    }
    return this.instance;
  }

  async getPandits(): Promise<IPandit[]> {
    return PanditAPI.getPandit();
  }

  async updatePandit(payload: IPandit): Promise<IPandit> {
    return PanditAPI.updatePandit(payload);
  }

  async deletePandit({ id }: { id: string }): Promise<IPandit> {
    return PanditAPI.deletePandit({ id });
  }

  async createPandit(payload: IPandit): Promise<IPandit> {
    return PanditAPI.createPandit(payload);
  }

  async getByIds({ ids }: { ids: string[] }): Promise<IPandit[]> {
    return PanditAPI.getByIds({ ids });
  }
}
