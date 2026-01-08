import { UserAPI } from "./user.api";
import type { UserProps } from "./user.type";

export class UserController {
  private static instance: UserController;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new UserController();
    }
    return this.instance;
  }

  async getUsers(): Promise<UserProps[]> {
    return UserAPI.getUsers();
  }

  async updateUser(payload: UserProps): Promise<UserProps> {
    return UserAPI.updateUser(payload);
  }

  async deleteUser({ id }: { id: string }): Promise<UserProps> {
    return UserAPI.deleteUser({ id });
  }

  async createUser(payload: UserProps): Promise<UserProps> {
    return UserAPI.createUser(payload);
  }

  async getByIds({ ids }: { ids: string[] }): Promise<UserProps[]> {
    return UserAPI.getByIds({ ids });
  }
}
