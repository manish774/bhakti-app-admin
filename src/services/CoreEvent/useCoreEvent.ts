import { useCallback, useEffect, useState } from "react";
import { CoreEventController } from "./coreevent.controller";
import type { CoreEventProps } from "./coreevent.types";

interface UseCoreEventState {
  coreEvents: CoreEventProps[];
  loading: boolean;
  error: string | null;
}

interface UseCoreEventReturn extends UseCoreEventState {
  refetch: () => Promise<void>;
  fetch: () => Promise<void>;
  create: (payload: CoreEventProps) => Promise<CoreEventProps | null>;
  update: (payload: CoreEventProps) => Promise<CoreEventProps | null>;
  remove: ({ type }: { type: string }) => Promise<CoreEventProps | null>;
}

export const useCoreEvent = ({
  autoFetch = true,
}: {
  autoFetch: boolean;
}): UseCoreEventReturn => {
  const [state, setState] = useState<UseCoreEventState>({
    coreEvents: [],
    loading: autoFetch,
    error: null,
  });

  const controller = CoreEventController.getInstance();

  const fetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const data = await controller.getCoreEvents();

      setState((prev) => ({
        ...prev,
        loading: false,
        //@ts-expect-error expected
        coreEvents: data.data?.data || data.data || data,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        coreEvents: [],
        loading: false,
        error:
          err instanceof Error ? err.message : "Failed to fetch Core Events",
      }));
    }
  }, [controller]);

  const create = useCallback(
    async (payload: CoreEventProps): Promise<CoreEventProps> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const created = await controller.createCoreEvent(payload);
        setState((prev) => ({ ...prev, loading: false, error: null }));
        return created;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create Core Event";
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

  const remove = useCallback(
    async ({ type }: { type: string }): Promise<CoreEventProps> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const deleted = await controller.deleteCoreEvent({ type });
        setState((prev) => ({ ...prev, loading: false, error: null }));
        return deleted;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete Core Event";
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

  const update = useCallback(
    async (payload): Promise<CoreEventProps> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const updated = await controller.updateCoreEvent(payload);
        setState((prev) => ({ ...prev, loading: false, error: null }));
        return updated;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update Core Event";
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

  useEffect(() => {
    if (autoFetch) {
      fetch();
    }
  }, [autoFetch, fetch]);

  return {
    ...state,
    refetch: fetch,
    create,
    fetch,
    remove,
    update,
  };
};
