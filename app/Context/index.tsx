"use client"

import { createContext, useReducer, Dispatch, ReactNode } from "react";

interface QuickstartState {
  linkSuccess: boolean;
  isItemAccess: boolean;
  isPaymentInitiation: boolean;
  isUserTokenFlow: boolean;
  isCraProductsExclusively: boolean;
  linkToken: string | null;
  accessToken: string | null;
  userToken: string | null;
  itemId: string | null;
  isError: boolean;
  backend: boolean;
  products: string[];
  linkTokenError: {
    error_message: string;
    error_code: string;
    error_type: string;
  };
  // +++ ADDED: State to trigger account data refresh +++
  accountDataVersion: number;  
}

const initialState: QuickstartState = {
  linkSuccess: false,
  isItemAccess: true,
  isPaymentInitiation: false,
  isCraProductsExclusively: false,
  isUserTokenFlow: false,
  linkToken: "", // Don't set to null or error message will show up briefly when site loads
  userToken: null,
  accessToken: null,
  itemId: null,
  isError: false,
  backend: true,
  products: ["transactions"],
  linkTokenError: {
    error_type: "",
    error_code: "",
    error_message: "",
  },
  // +++ ADDED: Initialize the trigger state +++
  accountDataVersion: 0,  
};

type QuickstartAction = {
  type: "SET_STATE";
  state: Partial<QuickstartState>;
} | {
  // +++ ADDED: Optional dedicated action for clarity, though SET_STATE works +++
  type: "TRIGGER_ACCOUNT_REFRESH";
};

interface QuickstartContext extends QuickstartState {
  dispatch: Dispatch<QuickstartAction>;
}

const Context = createContext<QuickstartContext>(
  initialState as QuickstartContext
);

const { Provider } = Context;
export const QuickstartProvider: React.FC<{ children: ReactNode }> = (
  props
) => {
  const reducer = (
    state: QuickstartState,
    action: QuickstartAction
  ): QuickstartState => {
    console.log("QuickstartProvider: Reducing action", action);
    switch (action.type) {
      case "SET_STATE":
        return { ...state, ...action.state };
      // +++ ADDED: Handle the dedicated refresh action +++
      case "TRIGGER_ACCOUNT_REFRESH":
        return { ...state, accountDataVersion: state.accountDataVersion + 1 };        
      default:
        return { ...state };
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Provider value={{ ...state, dispatch }}>{props.children}</Provider>;
};

export default Context;
