import type { Dispatch } from "react";
import type { GAction, IState } from "./General.types";
import { ACTION_TYPES } from "./General.types";
import type { IServiceManager } from "./utils";

export class GeneralContextController {
  private static instance: GeneralContextController | null = null;

  private state!: IState;
  private dispatch!: Dispatch<GAction>;
  private serviceManager: IServiceManager;

  constructor(state: IState, dispatch: Dispatch<GAction>, serviceManager: any) {
    this.state = state;
    this.dispatch = dispatch;
    this.serviceManager = serviceManager;
    this.init();
  }

  public static getInstance(
    state: IState,
    dispatch: Dispatch<GAction>,
    serviceManager: any,
  ) {
    if (!GeneralContextController.instance) {
      GeneralContextController.instance = new GeneralContextController(
        state,
        dispatch,
        serviceManager,
      );
    }

    return GeneralContextController.instance;
  }

  init() {
    console.log("inint", this.serviceManager.bookingController);
    this.serviceManager?.bookingController?.getBookings().then((x) => {
      console.log(x, "ppppp oop");
    });
  }

  getState() {
    return this.state;
  }

  updateNumber() {
    this.dispatch({
      type: ACTION_TYPES.NUMBER_OF_TEMPLE,
      payload: { value: 111 },
    });
  }

  setLoading(loading: boolean) {
    this.dispatch({
      type: ACTION_TYPES.NUMBER_OF_TEMPLE,
      payload: { loading },
    });
  }

  reset() {
    this.dispatch({ type: ACTION_TYPES.RESET, payload: { value: 0 } });
  }
}
