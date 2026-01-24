import { ACTION_TYPES, type IState } from "./General.types";

export const GeneralReducer = (
  state: IState,
  action: { type: ACTION_TYPES; payload: Record<string, any> }
): IState => {
  console.log(state, "state in reducer");
  switch (action.type) {
    case ACTION_TYPES.NUMBER_OF_TEMPLE: {
      return { ...state, numberOfTemples: state.numberOfTemples + 10 || 0 };
    }
    default:
      return state;
  }
};
