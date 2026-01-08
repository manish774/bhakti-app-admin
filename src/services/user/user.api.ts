import apiClient from "../interceptor";
import type { UserProps, UpdateUserPayload } from "./user.type";

export const UserAPI = {
  getUsers: async (): Promise<UserProps[]> => {
    const result = await apiClient.get("api/admin/users");
    if (!result) throw Error("Some issue");
    return result.data;
  },
  getByIds: async ({ ids }: { ids: string[] }): Promise<UserProps[]> => {
    const result = await apiClient.post("api/user/getByIds", { ids });
    if (!result) throw Error("Some issue");
    return result.data;
  },
  createUser: async (payload: UserProps): Promise<UserProps> => {
    const result = await apiClient.post("api/user/create", { ...payload });
    return result.data;
  },
  deleteUser: async ({ id }: { id: string }): Promise<UserProps> => {
    //@ts-expect-error expected
    const result = await apiClient.delete("api/user/create", { id: id });
    return result.data;
  },
  updateUser: async (payload: UpdateUserPayload): Promise<UserProps> => {
    const result = await apiClient.patch("api/user/update", { ...payload });
    return result.data;
  },
};
