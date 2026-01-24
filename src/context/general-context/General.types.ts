export type IState = {
  numberOfTemples: number;
  numberOfevents: number;
};

//@ts-expect-error sjgjhgs
export enum ACTION_TYPES {
  NUMBER_OF_TEMPLE,
  EVENT,
  RESET,
}

export type GAction = {
  type: ACTION_TYPES;
  payload: Record<string, any>;
};
