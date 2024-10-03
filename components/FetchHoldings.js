/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect } from "react";
import apiClient from "@/libs/api";
import { AccountInformationApi } from "snaptrade-typescript-sdk";

const FetchHoldings = ({ userId, snaptrade_user_secret, accountId }) => {
  
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
          accountId
        });
        //TODO: Implement redux dispatch here
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchHoldings();
  }, [userId, snaptrade_user_secret, accountId]);
  return <></>;
};

export default FetchHoldings;
