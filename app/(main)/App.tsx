"use client"
import React, { useEffect, useContext, useCallback } from "react";

import Header from "../../components/Headers";
import Context from "./../Context";
import AccountManager from "../../components/accountManager";

const App = () => {
  const { linkSuccess, isPaymentInitiation, itemId, dispatch } =
    useContext(Context);

  const getInfo = useCallback(async () => {
    const response = await fetch("/api/info", { method: "POST" });
    if (!response.ok) {
      dispatch({ type: "SET_STATE", state: { backend: false } });
      return { paymentInitiation: false };
    }
    const data = await response.json();
    const paymentInitiation: boolean =
      data.products.includes("payment_initiation");
    const craEnumValues: string[] = ["cra_check_report", "cra_income_insights", "cra_partner_insights"]; // Example CRA values
    const isUserTokenFlow: boolean = data.products.some(
      (product: string) => craEnumValues.includes(product)
    );
    const isCraProductsExclusively: boolean = data.products.every(
      (product: string) => craEnumValues.includes(product)
    );
    dispatch({
      type: "SET_STATE",
      state: {
        products: data.products,
        isPaymentInitiation: paymentInitiation,
        isCraProductsExclusively: isCraProductsExclusively,
        isUserTokenFlow: isUserTokenFlow,
      },
    });
    return { paymentInitiation, isUserTokenFlow };
  }, [dispatch]);

  const generateUserToken = useCallback(async () => {
    const response = await fetch("api/create_user_token", { method: "POST" });
    if (!response.ok) {
      dispatch({ type: "SET_STATE", state: { userToken: null } });
      return;
    }
    const data = await response.json();
    if (data) {
      if (data.error != null) {
        dispatch({
          type: "SET_STATE",
          state: {
            linkToken: null,
            linkTokenError: {
              error_message: data.error,
              error_code: "INVALID_REQUEST",
              error_type: "API_ERROR"
            },
          },
        });
        return;
      }
      dispatch({ type: "SET_STATE", state: { userToken: data.user_token } });
      return data.user_token;
    }
  }, [dispatch]);

  interface LinkTokenResponse {
    link_token?: string;
    error?: string;
  }

  interface GenerateTokenProps {
    isPaymentInitiation: boolean;
  }

    const generateToken = useCallback(
      async (isPaymentInitiation: boolean): Promise<void> => {
        // Link tokens for 'payment_initiation' use a different creation flow in your backend.
        const path: string = isPaymentInitiation
          ? "/api/create_link_token_for_payment"
          : "/api/create_link_token";
        const response: Response = await fetch(path, {
          method: "POST",
        });
        if (!response.ok) {
          dispatch({ type: "SET_STATE", state: { linkToken: null } });
          return;
        }
        const data: LinkTokenResponse = await response.json();
        if (data) {
          if (data.error != null) {
            dispatch({
              type: "SET_STATE",
              state: {
                linkToken: null,
                linkTokenError: {
                  error_message: data.error,
                  error_code: "INVALID_REQUEST",
                  error_type: "API_ERROR"
                },
              },
            });
            return;
          }
          dispatch({ type: "SET_STATE", state: { linkToken: data.link_token } });
        }
        // Save the link_token to be used later in the Oauth flow.
        localStorage.setItem("link_token", data.link_token!);
      },
      [dispatch]
    );

  useEffect(() => {
    const init = async () => {
      const { paymentInitiation, isUserTokenFlow } = await getInfo(); // used to determine which path to take when generating token
      // do not generate a new token for OAuth redirect; instead
      // setLinkToken from localStorage
      if (window.location.href.includes("?oauth_state_id=")) {
        dispatch({
          type: "SET_STATE",
          state: {
            linkToken: localStorage.getItem("link_token"),
          },
        });
        return;
      }

      if (isUserTokenFlow) {
        await generateUserToken();
      }
      generateToken(paymentInitiation);
    };
    init();
  }, [dispatch, generateToken, generateUserToken, getInfo]);



  return (
    <div>
      <div>
        <Header />
        <AccountManager />         
      </div>
    </div>
  );
};

export default App;
