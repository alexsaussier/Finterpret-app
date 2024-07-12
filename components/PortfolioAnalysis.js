"use client";

import { sendOpenAi } from "@/libs/gpt";
import React, { useState } from 'react';
import ButtonGlass from "./ButtonGlass";


export const PortfolioAnalysis = ({ portfolioGeneralData }) => {

    const [gptResponse, setGptResponse] = useState('');


    const guideline = "You are a financial advisor. You are helping a client understand all sorts of financial metrics. Your tone should be serious but friendly" +
  " Answer in HTML format. Use 1 <br> tags between each paragraph." +
  " Use <b> tags to put the important statements in bold. " + 
  " You should sound very confident in your answer, as if you are a financial advisor." +
  " Make the response very concise and easy to understand for the common folk. The person reading that does not know anything about finance.";


    const gptMessage = "I am your client, here are some metrics about my portfolio:\n" +
    "The total value of my portfolio is " + portfolioGeneralData.totalValue + "\n" +
    "My average P/E ratio is " + portfolioGeneralData.peRatio + "\n" +
    "My average EPS is " + portfolioGeneralData.eps + "\n" +
    "My average dividend yield is " + portfolioGeneralData.divYield + "\n" +
    "The percentage of companies that I own that are profitable is" + portfolioGeneralData.profitable + "\n" +
    "The percentage of companies that I own that pay dividends is" + portfolioGeneralData.dividendPaying + "\n" +
    "Can you explain to me the risks associated to the metrics of my portfolio? " +
    "and provide me with some advice on how to improve my portfolio?" + 
    "You should not list all the metrics I provide, just give me an overall overview. "


    const fetchGptResponse = async () => {

        try{
            sendOpenAi(guideline, gptMessage, "1", 300).then((data) => {
            setGptResponse(data);
            console.log(response);
            });
        }catch(e){
            console.error("Error: " + e);
        };
    };
    

    return(

        <div className="bg-white rounded-lg p-5 shadow-md relative">
            <h1 className="text-lg md:text-xl font-bold text-left mb-4">
            General Portfolio Analysis and Advice
            </h1>

            <div className="relative">
                <div className="flex flex-col">
                    
                {!gptResponse && <ButtonGlass title="Generate" onClick={fetchGptResponse} />}
                {gptResponse && 
                    <div className="mt-4">
                        <section dangerouslySetInnerHTML={{ __html: gptResponse }}/>
                    </div>
                }

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

