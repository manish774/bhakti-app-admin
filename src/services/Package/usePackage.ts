import { useCallback, useEffect, useState } from "react";
import { PackageController } from "./packages.controller";
import type { PackageProps } from "./packages.types";

interface UsePackagesState {
  packages: PackageProps[];
  loading: boolean;
  error: string | null;
}

export const usePackage = ({ autoFetch = true }: { autoFetch: boolean }) => {
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
      setState((prev) => ({ ...prev, loading: false, packages: data }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        packages: [],
        loading: false,
        error: err instanceof Error ? err.message : "Failed to fetch packages",
      }));
    }
  }, [controller]);

  const deletePackage = async () => {};
  const updatePackage = async () => {};

  useEffect(() => {
    if (autoFetch) {
      fetchPackages();
    }
  }, [autoFetch, fetchPackages]);

  return {
    ...state,
    fetchPackages,
    deletePackage,
    updatePackage,
  };
};
