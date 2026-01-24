import { useReducer } from "react";
import { GeneralContextController } from "./GeneralContextController";
import { createAllContext } from "../createAllContext";
import { GeneralReducer } from "./GeneralReducer";
import type { IState } from "./General.types";
import { ServicesManager } from "./utils";

const initialValue: IState = {
  numberOfevents: 0,
  numberOfTemples: 0,
};

const { Context, useAllContext } = createAllContext<
  IState,
  GeneralContextController
>(initialValue);

export const useGeneralContexts = useAllContext;

const GeneralContext = (props: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(GeneralReducer, initialValue);
  const controller = new GeneralContextController(
    state,
    dispatch,
    ServicesManager,
  );

  return (
    <Context.Provider value={{ state, controller }}>
      {props.children}
    </Context.Provider>
  );
};

export default GeneralContext;
