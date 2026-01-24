import { useCallback, useEffect, useState } from "react";
import { PackageController } from "./packages.controller";
import type { PackageProps } from "./packages.types";

interface UsePackagesState {
  packages: PackageProps[];
  loading: boolean;
  error: string | null;
}

interface UsePackagesReturn extends UsePackagesState {
  refetch: () => Promise<void>;
  fetchPackages: () => Promise<void>;
  fetchPackageByIDs: (ids) => Promise<PackageProps[]>;
  createPackage: (payload: PackageProps) => Promise<PackageProps | null>;
  updatePackage: (payload: PackageProps) => Promise<PackageProps | null>;
  deletePackage: ({ id }: { id: string }) => Promise<PackageProps | null>;
}

export const usePackage = ({
  autoFetch = true,
}: {
  autoFetch: boolean;
}): UsePackagesReturn => {
  const [state, setState] = useState<UsePackagesState>({
    packages: [],
    loading: autoFetch,
    error: null,
  });

  const controller = PackageController.getInstance();
  const fetchPackages = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const data = await controller.getPackages();
      console.log(data);
      setState((prev) => ({
        ...prev,
        loading: false,
        //@ts-expect-error expected
        packages: data.data.data,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        packages: [],
        loading: false,
        error: err instanceof Error ? err.message : "Failed to fetch packages",
      }));
    }
  }, [controller]);
  const createPackage = useCallback(
    async (payload: PackageProps): Promise<PackageProps> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const deletedPackage = await controller.createPackage(payload);
        setState((prev) => ({ ...prev, loading: false, error: null }));
        return deletedPackage;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create package";
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        throw err;
      }
    },
    [controller]
  );
  const deletePackage = useCallback(
    async ({ id }: { id: string }): Promise<PackageProps> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const deletedPackage = await controller.deletePackage({ id });
        setState((prev) => ({ ...prev, loading: false, error: null }));
        return deletedPackage;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete package";
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        throw err;
      }
    },
    [controller]
  );
  const updatePackage = useCallback(
    async (payload): Promise<PackageProps> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const deletedPackage = await controller.updatePacakage(payload);
        setState((prev) => ({ ...prev, loading: false, error: null }));
        return deletedPackage;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update package";
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        throw err;
      }
    },
    [controller]
  );
  const fetchPackageByIDs = useCallback(
    async (ids): Promise<PackageProps[]> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const data = await controller.getByIds({ ids });
        setState((prev) => ({
          ...prev,
          loading: false,
          //@ts-expect-error expected
          packages: data.data,
        }));
        //@ts-expect-error expected
        return data.data;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          packages: [],
          loading: false,
          error:
            err instanceof Error ? err.message : "Failed to fetch packages",
        }));
      }
    },
    [controller]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchPackages();
    }
  }, [autoFetch, fetchPackages]);

  return {
    ...state,
    fetchPackageByIDs,
    refetch: fetchPackages,
    createPackage,
    fetchPackages,
    deletePackage,
    updatePackage,
  };
};
