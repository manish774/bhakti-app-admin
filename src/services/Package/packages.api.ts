import apiClient from "../interceptor";
import type { PackageProps, UpdatePackagePayload } from "./packages.types";

export const PackageAPI = {
  getPackages: async (): Promise<PackageProps[]> => {
    const result = await apiClient.get("api/package/get");
    if (!result) throw Error("Some issue");
    return result.data;
  },
  getByIds: async ({ ids }: { ids: string[] }): Promise<PackageProps[]> => {
    const result = await apiClient.post("api/package/getByIds", { ids });
    if (!result) throw Error("Some issue");
    return result.data;
  },
  createPackage: async (payload: PackageProps): Promise<PackageProps> => {
    const result = await apiClient.post("api/package/create", { ...payload });
    return result.data;
  },
  deletePackage: async ({ id }: { id: string }): Promise<PackageProps> => {
    //@ts-expect-error expected
    const result = await apiClient.delete("api/package/create", { id: id });
    return result.data;
  },
  updatePackage: async (
    payload: UpdatePackagePayload
  ): Promise<PackageProps> => {
    const result = await apiClient.patch("api/package/update", { ...payload });
    return result.data;
  },
};
