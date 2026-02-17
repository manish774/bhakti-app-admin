import { useCallback, useEffect, useState } from "react";
import { PanditController } from "./pandit.controller";
import type { IPandit } from "./pandit.types";

interface UsePanditsState {
  pandits: IPandit[];
  loading: boolean;
  error: string | null;
}

interface UsePanditsReturn extends UsePanditsState {
  refetch: () => Promise<void>;
  fetchPandits: () => Promise<void>;
  fetchPanditByIDs: (ids: string[]) => Promise<IPandit[]>;
  createPandit: (payload: IPandit) => Promise<IPandit | null>;
  updatePandit: (payload: IPandit) => Promise<IPandit | null>;
  deletePandit: ({ id }: { id: string }) => Promise<IPandit | null>;
}

export const usePandit = ({
  autoFetch = true,
}: {
  autoFetch: boolean;
}): UsePanditsReturn => {
  const [state, setState] = useState<UsePanditsState>({
    pandits: [],
    loading: autoFetch,
    error: null,
  });

  const controller = PanditController.getInstance();

  const fetchPandits = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const data = await controller.getPandits();

      setState((prev) => ({
        ...prev,
        loading: false,
        //@ts-expect-error expected
        pandits: data.data,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        pandits: [],
        loading: false,
        error: err instanceof Error ? err.message : "Failed to fetch pandits",
      }));
    }
  }, [controller]);

  const createPandit = useCallback(
    async (payload: IPandit): Promise<IPandit> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const createdPandit = await controller.createPandit(payload);
        setState((prev) => ({ ...prev, loading: false, error: null }));
        return createdPandit;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create pandit";
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        throw err;
      }
    },
    [controller],
  );

  const deletePandit = useCallback(
    async ({ id }: { id: string }): Promise<IPandit> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const deletedPandit = await controller.deletePandit({ id });
        setState((prev) => ({ ...prev, loading: false, error: null }));
        return deletedPandit;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete pandit";
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        throw err;
      }
    },
    [controller],
  );

  const updatePandit = useCallback(
    async (payload: IPandit): Promise<IPandit> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const updatedPandit = await controller.updatePandit(payload);
        setState((prev) => ({ ...prev, loading: false, error: null }));
        return updatedPandit;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update pandit";
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        throw err;
      }
    },
    [controller],
  );

  const fetchPanditByIDs = useCallback(
    async (ids: string[]): Promise<IPandit[]> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const data = await controller.getByIds({ ids });
        setState((prev) => ({
          ...prev,
          loading: false,
          //@ts-expect-error expected
          pandits: data.data,
        }));
        //@ts-expect-error expected
        return data.data;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          pandits: [],
          loading: false,
          error: err instanceof Error ? err.message : "Failed to fetch pandits",
        }));
        throw err;
      }
    },
    [controller],
  );

  useEffect(() => {
    if (autoFetch) {
      fetchPandits();
    }
  }, [autoFetch, fetchPandits]);

  return {
    ...state,
    fetchPanditByIDs,
    refetch: fetchPandits,
    createPandit,
    fetchPandits,
    deletePandit,
    updatePandit,
  };
};
