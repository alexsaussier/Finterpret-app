"use client";

import { sendOpenAi } from "@/libs/gpt";
import React, { useEffect, useState } from "react";
import ButtonGlass from "./ButtonGlass";
import { LoadingSpinner, RefreshIcon } from "@/utils/svgIcons";
import toast from 'react-hot-toast'; // Assuming you're using react-hot-toast for toasts

export const PortfolioAnalysis = ({ portfolioGeneralData }) => {
  const [gptResponse, setGptResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshesRemaining, setRefreshesRemaining] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      // Step 1: Fetch user data
      const userDataResponse = await fetch("/api/user/get-user-data");
      let userData = await userDataResponse.json();
      userData = userData.user;

      const currentTime = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      // Step 2: Check if generalAnalysis exists and is not older than 24 hours
      if (
        userData.generalAnalysis &&
        currentTime - userData.generalAnalysis.timeStamp < twentyFourHours
      ) {
        console.log(
          "gpt response in db for this user - Portfolio analysis is recent."
        );
        setGptResponse(userData.generalAnalysis.gptResponse);
      }

      if (userData.hasAccess) {
        setRefreshesRemaining('unlimited');
      } else {
        setRefreshesRemaining(3 - userData.analysisRefreshes.count);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array means this effect runs only once when the component mounts

  const guideline =
    "You are a financial advisor. You are helping a client understand all sorts of financial metrics. Your tone should be serious but friendly" +
    " Answer in HTML format. Use 1 <br> tags between each paragraph." +
    " You should sound very confident in your answer, as if you are a financial advisor." +
    " Make the response very concise and easy to understand for the common folk. The person reading that does not know anything about finance.";

  const gptMessage =
    "I am your client, here are some metrics about my portfolio:\n" +
    "The total value of my portfolio is " +
    portfolioGeneralData.totalValue +
    "\n" +
    "My average P/E ratio is " +
    portfolioGeneralData.peRatio +
    "\n" +
    "My average EPS is " +
    portfolioGeneralData.eps +
    "\n" +
    "My average dividend yield is " +
    portfolioGeneralData.divYield +
    "\n" +
    "The percentage of companies that I own that are profitable is" +
    portfolioGeneralData.profitable +
    "\n" +
    "The percentage of companies that I own that pay dividends is" +
    portfolioGeneralData.dividendPaying +
    "\n" +
    "Can you explain to me the risks associated to the metrics of my portfolio? " +
    "and provide me with some advice on how to improve my portfolio?" +
    "You should not list all the metrics I provide, just give me an overall overview. Do not start with an introduction sentence, and be very concise. ";

  const fetchGptResponse = async (forceRefetch = false) => {
    setIsLoading(true); // Start loading for displaying the svg icon
    console.log("General Analysis requested");

    try {
      // Perform GPT request
      const answerFromGpt = await sendOpenAi(
        guideline,
        gptMessage,
        "1",
        1000,
        0.5
      );
      setGptResponse(answerFromGpt);

      // Update the user in the database
      const response = await fetch("/api/user/set-portfolio-analysis-generated", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          gptAnalysis: answerFromGpt,
          forceRefetch: forceRefetch 
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("User updated successfully:", data);
        setRefreshesRemaining(data.refreshesRemaining);
      } else {
        throw new Error(data.error || "Failed to update analysis");
      }
    } catch (e) {
      console.error("Error: " + e);
      setGptResponse("An error occurred while generating the analysis. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading regardless of the outcome
    }
  };

  const handleForceRefetch = () => {
    console.log("Refreshes remaining: " + refreshesRemaining);
    if (refreshesRemaining === 0) {
      toast.error("You have reached the daily limit for refreshes. Please try again tomorrow or upgrade your account.");
    } else {
      setGptResponse("Generating a fresh new analysis of your portfolio...");
      fetchGptResponse(true);
    }
  };

  return (
    <div className="bg-white rounded-lg p-5 shadow-md relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg md:text-xl font-bold">
          General Portfolio Analysis and Advice
        </h1>
        {!isLoading && (
          <div className="flex flex-col items-end">
            <ButtonGlass
              title={
                <span className="flex items-center">
                  <RefreshIcon />
                  Refresh Analysis
                </span>
              }
              onClick={handleForceRefetch}
            />
            {refreshesRemaining !== 'unlimited' && (
              <span className="text-sm text-gray-500 mt-1">
                Refreshes remaining: {refreshesRemaining}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="relative">
        <div className="flex flex-col">
          {!gptResponse && !isLoading && (
            <ButtonGlass title="Generate" onClick={() => fetchGptResponse(false)} />
          )}
          
          {isLoading && <LoadingSpinner />}

          {gptResponse && (
            <div className="mt-4">
              <section dangerouslySetInnerHTML={{ __html: gptResponse }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
