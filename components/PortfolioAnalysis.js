"use client";

import { sendOpenAi } from "@/libs/gpt";
import React, { useEffect, useState } from "react";
import ButtonGlass from "./ButtonGlass";

export const PortfolioAnalysis = ({ portfolioGeneralData }) => {
  const [gptResponse, setGptResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    };

    fetchUserData();
  }, []); // Empty dependency array means this effect runs only once when the component mounts

  const guideline =
    "You are a financial advisor. You are helping a client understand all sorts of financial metrics. Your tone should be serious but friendly" +
    " Answer in HTML format. Use 1 <br> tags between each paragraph." +
    " Use <b> tags to put the important statements in bold. " +
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

  const fetchGptResponse = async () => {
    setIsLoading(true); // Start loading for displaying the svg icon
    console.log("General Analysis requested");

    try {
      // Perform GPT request
      const answerFromGpt = await sendOpenAi(
        guideline,
        gptMessage,
        "1",
        300,
        0
      );
      setGptResponse(answerFromGpt);

      // Step 4: Update the user in the database
      fetch("/api/user/set-portfolio-analysis-generated", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({ gptAnalysis: answerFromGpt }), // Ensure the body is properly stringified
      })
        .then((response) => response.json()) // Handle the response from the server
        .then((data) => console.log("User updated successfully:", data))
        .catch((error) => console.error("Error updating user:", error));
    } catch (e) {
      console.error("Error: " + e);
    } finally {
      setIsLoading(false); // Stop loading regardless of the outcome
    }
  };

  return (
    <div className="bg-white rounded-lg p-5 shadow-md relative">
      <h1 className="text-lg md:text-xl font-bold text-left mb-4">
        General Portfolio Analysis and Advice
      </h1>

      <div className="relative">
        <div className="flex flex-col">
          {!gptResponse && !isLoading && (
            <ButtonGlass title="Generate" onClick={fetchGptResponse} />
          )}
          {!gptResponse && isLoading && (
            <div className="text-center mt-4">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          )}

          {gptResponse && (
            <div className="mt-4">
              <section dangerouslySetInnerHTML={{ __html: gptResponse }} />
            </div>
          )}
        </div>
        {/*<div className="absolute flex flex-col top-0 left-0 right-0 bottom-0 bg-white bg-opacity-70 flex justify-center items-center text-black font-bold">
                    Get gold to see your portfolio report and access tailored advice
                    <a
                    href="http://localhost:3000/#pricing"
                    className="btn btn-primary"
                    >
                    Get Gold
                    </a>
                </div>*/}
      </div>
    </div>
  );
};
