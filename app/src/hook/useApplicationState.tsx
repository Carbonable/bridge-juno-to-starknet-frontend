import React, {
  useReducer,
  useCallback,
  useEffect,
  createContext,
  useContext,
} from "react";

type ApplicationState = {
  state: State;
  message_type: ApplicationMessageType;
  message: string;
  title: string;
};

enum ApplicationStateActions {
  ToggleMessage = "TOGGLE_MESSAGE",
  HideMessage = "HIDE_MESSAGE",
}
export enum State {
  Hidden = "hidden",
  Loading = "loading",
}
export enum ApplicationMessageType {
  Success = "success",
  Error = "error",
}

const INITIAL_STATE: ApplicationState = {
  state: State.Hidden,
  title: "",
  message: "",
  message_type: ApplicationMessageType.Success,
};

interface ToggleMessage {
  type: ApplicationStateActions.ToggleMessage;
  message: string;
  title: string;
  message_type: ApplicationMessageType;
}

interface HideMessage {
  type: ApplicationStateActions.HideMessage;
}

type ApplicationActions = ToggleMessage | HideMessage;

function applicationStateReducer(
  state: ApplicationState,
  action: ApplicationActions
) {
  switch (action.type) {
    case ApplicationStateActions.ToggleMessage:
      return {
        ...state,
        state: State.Loading,
        message: action.message,
        title: action.title,
        message_type: action.message_type,
      };
    case ApplicationStateActions.HideMessage:
      return {
        state: State.Hidden,
        message: "",
        title: "",
        message_type: ApplicationMessageType.Success,
      };
    default:
      return state;
  }
}

export function useApplicationState() {
  const { state, dispatch } = useContext(ApplicationStateContext);

  const hideMessage = useCallback(() => {
    dispatch({ type: ApplicationStateActions.HideMessage });
  }, []);

  const toggleMessage = useCallback(
    (
      message: string,
      type: ApplicationMessageType,
      title: string,
      withTimeout = true
    ) => {
      dispatch({
        type: ApplicationStateActions.ToggleMessage,
        message,
        title,
        message_type: type,
      });
      if (withTimeout) {
        setTimeout(() => hideMessage(), 5000);
      }
    },
    [hideMessage]
  );

  return { state, toggleMessage, hideMessage };
}

export const ApplicationStateContext = createContext<{
  state: ApplicationState;
  dispatch: () => void;
}>(INITIAL_STATE);

export function ApplicationStateProvider({
  children,
}: React.PropsWithChildren) {
  const [state, dispatch] = useReducer(applicationStateReducer, INITIAL_STATE);

  const value = { state, dispatch };
  return (
    <ApplicationStateContext.Provider value={value}>
      {children}
    </ApplicationStateContext.Provider>
  );
}
