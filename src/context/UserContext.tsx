import React, { createContext, useContext, useReducer, useEffect } from "react";
import Services from "../services/Services";

interface UserMeta {
  name: string;
  email: string;
}

interface UserContextProps {
  meta: UserMeta;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const defaultValue: UserContextProps = {
  meta: {
    name: "",
    email: "",
  },
  isLoading: true,
  isAuthenticated: false,
};

export type AppAction =
  | { type: "loginDetails"; payload: UserMeta }
  | { type: "logout" }
  | { type: "setLoading" }
  | { type: "initComplete" };

export interface AppContextType {
  state: UserContextProps;
  dispatch: React.Dispatch<AppAction>;
}

const UserState = createContext<AppContextType | undefined>(undefined);

const loginReducer = (
  state: UserContextProps,
  action: AppAction,
): UserContextProps => {
  switch (action.type) {
    case "loginDetails":
      return {
        meta: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };

    case "logout":
      return {
        meta: { name: "", email: "" },
        isAuthenticated: false,
        isLoading: false,
      };

    case "setLoading":
      return { ...state, isLoading: true };

    case "initComplete":
      return { ...state, isLoading: false };

    default:
      return state;
  }
};

export const UserContext = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(loginReducer, defaultValue);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const services = Services.getInstance();
        const userProfile = await services.restoreUserSession();

        if (userProfile?.email) {
          dispatch({
            type: "loginDetails",
            payload: userProfile,
          });
        } else {
          dispatch({ type: "initComplete" });
        }
      } catch (e) {
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
  if (!ctx) throw new Error("wrap it with UserContext provider");
  return ctx;
};
