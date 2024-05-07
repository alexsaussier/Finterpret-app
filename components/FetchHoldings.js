/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect } from "react";
import apiClient from "@/libs/api";

// A simple button to sign in with our providers (Google & Magic Links).
// It automatically redirects user to callbackUrl (config.auth.callbackUrl) after login, which is normally a private page for users to manage their accounts.
// If the user is already logged in, it will show their profile picture & redirect them to callbackUrl immediately.
const FetchHoldings = ({ userId, snaptrade_user_secret }) => {
  const params = new URLSearchParams({
    userId: userId,
    snaptrade_user_secret: snaptrade_user_secret,
  });
  const url = `/snaptrade/pull-holdings`;

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        if (!userId || !snaptrade_user_secret) {
          throw new Error(
            "Cannot fetch holdings: userId or snaptrade_user_secret is missing"
          );
        }

        const url = `/snaptrade/pull-holdings`;
        const response = await apiClient.post(url, {
          userId,
          snaptrade_user_secret,
        });
        //TODO: Implement redux dispatch here
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchHoldings();
  }, [userId, snaptrade_user_secret]);
  return <></>;
};

export default FetchHoldings;
