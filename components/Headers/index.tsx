"use client"
import React, { useContext, memo } from "react";
import { Button } from "@/components/ui/button"
import Link from "../Link";
import Context from "../../app/Context";

const Header = memo(() => {
  const {
    itemId,
    accessToken,
    userToken,
    linkToken,
    linkSuccess,
    isItemAccess,
    backend,
    linkTokenError,
    isPaymentInitiation,
  } = useContext(Context);

  return (
    <div>
      <h3>Plaid Connection</h3>

      {!linkSuccess ? (
        <>
          <h4>
            A sample end-to-end integration with Plaid
          </h4>
          <p>
            The Plaid flow begins when you want to connect your bank
            account to the Integrated application.
          </p>
          {/* message if backend is not running and there is no link token */}
          {!backend ? (
            <div>
              Unable to fetch link_token.
            </div>
          ) : /* message if backend is running and there is no link token */
          linkToken == null && backend ? (
            <div>
              <div>
                Unable to fetch link_token: please make sure server
                is running.
              </div>
              <div>
                Error Code: <code>{linkTokenError.error_code}</code>
              </div>
              <div>
                Error Type: <code>{linkTokenError.error_type}</code>{" "}
              </div>
              <div>Error Message: {linkTokenError.error_message}</div>
            </div>
          ) : linkToken === "" ? (
            <div className="pt-14">
              <Button disabled>
                Connecting...
              </Button>
            </div>
          ) : (
            <div className="pt-14">
              <Link />
            </div>
          )}
        </>
      ) : (
        <>
          {isPaymentInitiation ? (
            <>
              <h4>
                Congrats! Your payment is now confirmed.
                <p />
              </h4>
              <p>
                Now that the 'payment_id' stored in your server, you can use it
                to access the payment information:
              </p>
            </>
          ) : (
            /* If not using the payment_initiation product, show the item_id and access_token information */ <>
              {isItemAccess ? (
                <h4>
                  Successfully linked your bank account.
                </h4>
              ) : userToken ? (
                <h4>
                  Successfully linked data to a User.
                </h4>
              ) : (
                <h4>                  
                    Unable to create an item. Please contact support.                 
                </h4>
              )}
              <div>
                {itemId && (
                  <p>
                    <span></span>
                  </p>
                )}
                {userToken && (
                  <p>
                    <span>user_token</span>
                    <span>{userToken}</span>
                  </p>
                )}
              </div>
              {(isItemAccess || userToken) && (
              <div className="pt-14">
                <Link />
              </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
});

Header.displayName = "Header";

export default Header;
