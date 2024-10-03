/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect } from "react";
import apiClient from "@/libs/api";

const FetchAccounts = ({ userId, snaptrade_user_secret }) => {
 

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        if (!userId || !snaptrade_user_secret) {
          throw new Error(
            "Cannot fetch holdings: userId or snaptrade_user_secret is missing"
          );
        }

        const url = `/snaptrade/list-accounts`;
        const response = await apiClient.post(url, {
          userId,
          snaptrade_user_secret,
        });
        //TODO: Implement redux dispatch here
        const accountId = response["response"][0]["id"];
        console.log(accountId);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAccounts();
  }, [userId, snaptrade_user_secret]);
  return <></>;
};

export default FetchAccounts;
