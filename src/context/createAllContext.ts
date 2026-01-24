import { createContext, useContext } from "react";

export type CdmpContextType<S, C> = {
  state: S;
  controller: C;
};

export function createAllContext<S, C>(initialState: S) {
  const Context = createContext<CdmpContextType<S, C> | undefined>(undefined);

  const useAllContext = () => {
    const ctx = useContext(Context);
    if (!ctx) {
      throw new Error("useCdmpContext must be used within its Provider");
    }
    return ctx;
  };

  return {
    Context,
    useAllContext,
    initialState,
  };
}
