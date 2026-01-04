import { useCallback, useEffect, useState } from "react";
import { TempleController } from "./temple.controller";
import type { Temple } from "../../types/api";

interface UseTempleState {
  temples: Temple[];
  loading: boolean;
  error: string | null;
}

interface UseTempleReturn extends UseTempleState {
  refetch: () => Promise<void>;
  fetchTemples: () => Promise<void>;
  createTemple: (
    payload: Omit<Temple, "_id" | "createdAt" | "updatedAt" | "__v">
  ) => Promise<Temple | null>;
  updateTemple: (
    id: string,
    payload: Partial<Temple>
  ) => Promise<Temple | null>;
  deleteTemple: (id: string) => Promise<{ success: boolean } | null>;
  addPackage: (templeId: string, payload: any) => Promise<any | null>;
  deletePackage: (templeId: string, packageId: string) => Promise<any | null>;
  addImage: (file: File, templeId?: string) => Promise<any | null>;
  fetchTemplesByIDs: (ids: string[]) => Promise<Temple[]>;
}

export const useTemple = ({ autoFetch = true }: { autoFetch?: boolean }) => {
  const [state, setState] = useState<UseTempleState>({
    temples: [],
    loading: autoFetch,
    error: null,
  });

  const controller = TempleController.getInstance();

  const fetchTemples = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const data = await controller.getTemples();
      setState((prev) => ({ ...prev, loading: false, temples: data }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        temples: [],
        loading: false,
        error: err instanceof Error ? err.message : "Failed to fetch temples",
      }));
    }
  }, [controller]);

  const fetchTemplesByIDs = useCallback(
    async (ids: string[]): Promise<Temple[]> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const data = await controller.getByIds({ ids });
        setState((prev) => ({ ...prev, loading: false, temples: data }));
        //@ts-expect-error expected
        return data?.data?.data;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          temples: [],
          loading: false,
          error: err instanceof Error ? err.message : "Failed to fetch temples",
        }));
        return [];
      }
    },
    [controller]
  );

  const createTemple = useCallback(
    async (
      payload: Omit<Temple, "_id" | "createdAt" | "updatedAt" | "__v">
    ): Promise<Temple | null> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const created = await controller.createTemple(payload);
        setState((prev) => ({ ...prev, loading: false }));
        return created;
      } catch (err) {
        setState((prev) => ({ ...prev, loading: false, error: err?.message }));
        return null;
      }
    },
    [controller]
  );

  const updateTemple = useCallback(
    async (id: string, payload: Partial<Temple>): Promise<Temple | null> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const updated = await controller.updateTemple(id, payload);
        setState((prev) => ({ ...prev, loading: false }));
        return updated;
      } catch (err) {
        setState((prev) => ({ ...prev, loading: false, error: err?.message }));
        return null;
      }
    },
    [controller]
  );

  const deleteTemple = useCallback(
    async (id: string) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const res = await controller.deleteTemple(id);
        setState((prev) => ({ ...prev, loading: false }));
        return res;
      } catch (err) {
        setState((prev) => ({ ...prev, loading: false, error: err?.message }));
        return null;
      }
    },
    [controller]
  );

  const addPackage = useCallback(
    async (templeId: string, payload: any) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const res = await controller.addPackage(templeId, payload);
        setState((prev) => ({ ...prev, loading: false }));
        return res;
      } catch (err) {
        setState((prev) => ({ ...prev, loading: false, error: err?.message }));
        return null;
      }
    },
    [controller]
  );

  const deletePackage = useCallback(
    async (templeId: string, packageId: string) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const res = await controller.deletePackage(templeId, packageId);
        setState((prev) => ({ ...prev, loading: false }));
        return res;
      } catch (err) {
        setState((prev) => ({ ...prev, loading: false, error: err?.message }));
        return null;
      }
    },
    [controller]
  );

  const addImage = useCallback(
    async (file: File, templeId?: string) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const res = await controller.addImage(file, templeId);
        setState((prev) => ({ ...prev, loading: false }));
        return res;
      } catch (err) {
        setState((prev) => ({ ...prev, loading: false, error: err?.message }));
        return null;
      }
    },
    [controller]
  );

  useEffect(() => {
    if (autoFetch) fetchTemples();
  }, [autoFetch, fetchTemples]);

  return {
    ...state,
    refetch: fetchTemples,
    fetchTemples,
    fetchTemplesByIDs,
    createTemple,
    updateTemple,
    deleteTemple,
    addPackage,
    deletePackage,
    addImage,
  } as UseTempleReturn;
};
