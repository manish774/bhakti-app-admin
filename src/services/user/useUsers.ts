import { useCallback, useEffect, useState } from "react";
import { UserController } from "./user.controller";
import type { UserProps } from "./user.type";

interface UseUsersState {
  users: UserProps[];
  loading: boolean;
  error: string | null;
}

interface UseUsersReturn extends UseUsersState {
  refetch: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchUserByIDs: (ids: string[]) => Promise<UserProps[]>;
  createUser: (payload: UserProps) => Promise<UserProps | null>;
  updateUser: (payload: UserProps) => Promise<UserProps | null>;
  deleteUser: ({ id }: { id: string }) => Promise<UserProps | null>;
}

export const useUser = ({
  autoFetch = true,
}: {
  autoFetch: boolean;
}): UseUsersReturn => {
  const [state, setState] = useState<UseUsersState>({
    users: [],
    loading: autoFetch,
    error: null,
  });

  const controller = UserController.getInstance();

  const fetchUsers = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const data = await controller.getUsers();
      console.log(data);
      setState((prev) => ({
        ...prev,
        loading: false,
        //@ts-expect-error expected
        users: data.data.data,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        users: [],
        loading: false,
        error: err instanceof Error ? err.message : "Failed to fetch users",
      }));
    }
  }, [controller]);

  const createUser = useCallback(
    async (payload: UserProps): Promise<UserProps> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const createdUser = await controller.createUser(payload);
        setState((prev) => ({ ...prev, loading: false }));
        return createdUser;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Failed to create user",
        }));
      }
    },
    [controller]
  );

  const deleteUser = useCallback(
    async ({ id }: { id: string }): Promise<UserProps> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const deletedUser = await controller.deleteUser({ id });
        setState((prev) => ({ ...prev, loading: false }));
        return deletedUser;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Failed to delete user",
        }));
      }
    },
    [controller]
  );

  const updateUser = useCallback(
    async (payload: UserProps): Promise<UserProps> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const updatedUser = await controller.updateUser(payload);
        setState((prev) => ({ ...prev, loading: false }));
        return updatedUser;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Failed to update user",
        }));
      }
    },
    [controller]
  );

  const fetchUserByIDs = useCallback(
    async (ids: string[]): Promise<UserProps[]> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const data = await controller.getByIds({ ids });
        console.log(data);
        setState((prev) => ({
          ...prev,
          loading: false,
          //@ts-expect-error expected
          users: data.data,
        }));
        //@ts-expect-error expected
        return data.data;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          users: [],
          loading: false,
          error: err instanceof Error ? err.message : "Failed to fetch users",
        }));
      }
    },
    [controller]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [autoFetch, fetchUsers]);

  return {
    ...state,
    fetchUserByIDs,
    refetch: fetchUsers,
    createUser,
    fetchUsers,
    deleteUser,
    updateUser,
  };
};
