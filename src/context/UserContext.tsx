import React, { createContext, useContext, useReducer, useEffect } from "react";
import Services from "../services/Services";

interface UserContextProps {
  meta: {
    name: string;
    email: string;
  };
  isLoading: boolean;
}
const defaultValue: UserContextProps = {
  meta: {
    name: "",
    email: "",
  },
  isLoading: true,
};

export type AppAction = {
  type: "loginDetails" | "logout" | "setLoading" | "initComplete";
  payload?: UserContextProps;
};

export interface AppContextType {
  state: UserContextProps;
  dispatch: React.Dispatch<AppAction>;
}

const UserState = createContext<AppContextType | undefined>(undefined);

type UserContext = {
  children: React.ReactNode;
};

const loginReducer = (
  state: UserContextProps,
  action: AppAction
): UserContextProps => {
  switch (action.type) {
    case "loginDetails":
      return {
        ...state,
        meta: action.payload?.meta || defaultValue.meta,
        isLoading: false,
      };
    case "logout":
      return { ...defaultValue, isLoading: false };
    case "setLoading":
      return {
        ...state,
        isLoading: true,
      };
    case "initComplete":
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};
export const UserContext = ({ children }: UserContext) => {
  const [state, dispatch] = useReducer(loginReducer, defaultValue);

  useEffect(() => {
    const initializeAuth = async () => {
      const services = Services.getInstance();
      const userProfile = await services.restoreUserSession();

      if (userProfile) {
        dispatch({
          type: "loginDetails",
          payload: {
            meta: userProfile,
            isLoading: false,
          },
        });
      } else {
        dispatch({ type: "initComplete" });
      }
    };

    initializeAuth();
  }, []);

  return (
    <UserState.Provider value={{ state, dispatch }}>
      {children}
    </UserState.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserState);
  if (!ctx) throw Error("wrap it with context dude!");
  return ctx;
};
