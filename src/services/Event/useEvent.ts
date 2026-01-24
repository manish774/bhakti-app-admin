import { useCallback, useEffect, useState } from "react";
import { EventController } from "./event.controller";
import type { EventProps } from "./event.types";

interface UseEventState {
  events: EventProps[];
  loading: boolean;
  error: string | null;
}

interface UseEventReturn extends UseEventState {
  refetch: () => Promise<void>;
  fetch: () => Promise<void>;
  create: (payload: EventProps) => Promise<EventProps | null>;
  update: (payload: EventProps) => Promise<EventProps | null>;
  remove: ({ id }: { id: string }) => Promise<EventProps | null>;
}

export const useEvent = ({
  autoFetch = true,
}: {
  autoFetch: boolean;
}): UseEventReturn => {
  const [state, setState] = useState<UseEventState>({
    events: [],
    loading: autoFetch,
    error: null,
  });
  const controller = EventController.getInstance();

  const fetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const data = await controller.getEvents();

      setState((prev) => ({
        ...prev,
        loading: false,
        //@ts-expect-error expected
        events: data.data?.data,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        events: [],
        loading: false,
        error: err instanceof Error ? err.message : "Failed to fetch Events",
      }));
    }
  }, [controller]);

  const create = useCallback(
    async (payload: EventProps): Promise<EventProps> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const created = await controller.createEvent(payload);
        setState((prev) => ({ ...prev, loading: false, error: null }));
        return created;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create Events";
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
    async ({ id }: { id: string }): Promise<EventProps> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const deleted = await controller.deleteEvent({ id });
        setState((prev) => ({ ...prev, loading: false }));
        return deleted;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            err instanceof Error ? err.message : "Failed to delete packages",
        }));
      }
    },
    [controller]
  );
  const update = useCallback(
    async (payload): Promise<EventProps> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const updated = await controller.updateEvent(payload);
        setState((prev) => ({ ...prev, loading: false, error: null }));
        return updated;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update Event";
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
