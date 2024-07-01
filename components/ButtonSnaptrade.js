/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession, signIn } from "next-auth/react";
import config from "@/config";
import { useState } from "react";
import apiClient from "@/libs/api";

// A simple button to sign in with our providers (Google & Magic Links).
// It automatically redirects user to callbackUrl (config.auth.callbackUrl) after login, which is normally a private page for users to manage their accounts.
// If the user is already logged in, it will show their profile picture & redirect them to callbackUrl immediately.
const ButtonSnaptrade = ({
  title = "Import portfolio",
  snaptrade_user_secret,
}) => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleSnaptrade = async () => {
    //Fetch the snaptrade_user_secret associated to the id of the logged in user
    //if cannot fetch than register user and fetch again
    //store in variable
    const userId = session.user.id;
    console.log("userId: " + userId);

    //Check if user is registered with snaptrade.

    console.log("user secret: " + snaptrade_user_secret);


    if (!snaptrade_user_secret) {
      try {
        console.log("registering user with snaptrade");
        await apiClient.post("/snaptrade/register-user", {
          userId,
        });
      } catch (e) {
        //If user is in fact registered with snaptrade, but there is no snaptrade_user_secret it will get a new one
        console.error(e);
        if (e.response.status === 404) {
          await apiClient.post("/snaptrade/reset-user-secret", {
            userId,
          });
        }

        console.error(e);
      }
    }


  
    if (status === "authenticated") {
      try {
        const result = await apiClient.post("/snaptrade/redirect-URI", {
          userId,
          snaptrade_user_secret,
        });

        window.location.href = result.redirectURI;

        // Tanstack query
        //change status of user --> imported_portfolio = TRUE. We need a db entry for that.
        await apiClient.post("/user/set-wallet-imported");
      } catch (e) {
        console.error(e);
      }
    } else {
      signIn(undefined, { callbackUrl: config.auth.callbackUrl });
    }
  };

  return (
    <button
      className="btn btn-gradient animate-shimmer"
      onClick={handleSnaptrade}
    >
      {title}
    </button>
  );
};

export default ButtonSnaptrade;
