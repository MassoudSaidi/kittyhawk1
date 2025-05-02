"use client"
import React, { useEffect, useContext, memo } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useRouter } from "next/navigation"; // For App Router

import Context from "../../app/Context"; 
import { Button } from "@/components/ui/button";

const Link = memo(() => {
  const router = useRouter();
  const { linkToken, isPaymentInitiation, isCraProductsExclusively, dispatch } =
    useContext(Context);

  const onSuccess = React.useCallback(
    async (public_token: string) => { // Make onSuccess async to await the fetch
      let dbUpdateSuccessful = false; // Flag to track if DB update likely happened

      // 'payment_initiation' products do not require the public_token to be exchanged for an access_token.
      if (isPaymentInitiation) {
        dispatch({ type: "SET_STATE", state: { isItemAccess: false } });
        // Assuming no DB update is needed here for the refresh trigger,
        // but if there is some other action that should trigger refresh, add dispatch here.
        // dbUpdateSuccessful = true; // Or set based on relevant action
      } else if (isCraProductsExclusively) {
        // When only CRA products are enabled, only user_token is needed. access_token/public_token exchange is not needed.
        dispatch({ type: "SET_STATE", state: { isItemAccess: false } });
        // Assuming no DB update is needed here for the refresh trigger.
        // dbUpdateSuccessful = true; // Or set based on relevant action
      } else {
        // If the access_token is needed, send public_token to server
        try {
          console.log("Exchanging public token...");
          const response = await fetch("/api/set_access_token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: `public_token=${public_token}`,
          });

          if (!response.ok) {
            // Handle failed exchange/DB update
            console.error("Failed to set access token. Status:", response.status);
            const errorData = await response.text(); // Read error message if possible
            console.error("Error details:", errorData)
            dispatch({
              type: "SET_STATE",
              state: {
                itemId: `no item_id retrieved`,
                accessToken: `no access_token retrieved`,
                isItemAccess: false,
              },
            });
            // Do NOT set dbUpdateSuccessful to true
          } else {
            // Exchange and DB update successful
            const data = await response.json();
            console.log("Access token set successfully:", data);
            dispatch({
              type: "SET_STATE",
              state: {
                itemId: data.item_id,
                accessToken: data.access_token,
                isItemAccess: true,
              },
            });
            dbUpdateSuccessful = true; // Mark as successful
          }
        } catch (error) {
           console.error("Error during public token exchange:", error);
           dispatch({
             type: "SET_STATE",
             state: {
               itemId: `error retrieving item_id`,
               accessToken: `error retrieving access_token`,
               isItemAccess: false,
             },
           });
           // Do NOT set dbUpdateSuccessful to true
        }
      }

      // --- Trigger Refresh ONLY if the DB update was expected and successful ---
      if (dbUpdateSuccessful) {
        console.log("Dispatching TRIGGER_ACCOUNT_REFRESH after successful operation.");
        dispatch({ type: "TRIGGER_ACCOUNT_REFRESH" });
      } else {
        console.log("Skipping TRIGGER_ACCOUNT_REFRESH as DB update did not occur or failed.");
      }

      dispatch({ type: "SET_STATE", state: { linkSuccess: true } });
      router.push("/"); // Navigate after all processing
    },
    [dispatch, isPaymentInitiation, isCraProductsExclusively, router] // Added router to dependencies
  );

  let isOauth = false;
  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken!,
    onSuccess,
  };

  // This check needs to happen reliably. Ensure window is defined.
  if (typeof window !== "undefined" && window.location.href.includes("?oauth_state_id=")) {
    // @ts-ignore // Plaid's types might not include receivedRedirectUri directly in base config
    config.receivedRedirectUri = window.location.href;
    isOauth = true;
  }

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    // This effect now ONLY handles auto-opening Link on OAuth return
    if (isOauth && ready) {
      console.log("OAuth redirect detected, opening Plaid Link to handle...");
      open();
    }
  }, [ready, open, isOauth]);



  return (
    <Button type="button" variant="default" onClick={() => open()} disabled={!ready || !linkToken}>
      {linkToken ? "Connect Bank Account" : "Loading..."}
    </Button>
  );
});

Link.displayName = "Link";

export default Link;