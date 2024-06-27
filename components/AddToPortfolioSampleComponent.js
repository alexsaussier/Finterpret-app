"use client";
import { useState } from "react";
import AddStockModal from "./AddStockModal";
import { StockTickerSearch } from "./StockTickerSearch";



export const AddToPortfolioSampleComponent = () => {
  const [openModal, setOpenModal] = useState(false);
  const [ticker, setTicker] = useState();
  const [units, setUnits] = useState();


  const saveToPorftolio = async () => {
    try {
      const response = await fetch("/api/user/add-stocks-to-portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticker,
          units,
        }),
      });

      if (response.ok) {
        // Handle success
        console.log("Data saved to portfolio");
      } else {
        // Handle error
        console.error("Failed to save data to portfolio");
      }
    } catch (error) {
      console.error("An error occurred while saving data to portfolio:", error);
    }
  };


  return (
    <div className="bg-white rounded-lg p-5 shadow-md flex flex-col">
      <h1 className="text-lg md:text-xl font-bold text-left mb-2">
        Update your holdings manually
      </h1>

      <div className="mb-2 flex">
        <StockTickerSearch
          ticker={ticker}
          setTicker={setTicker}
          units={units}
          setUnits={setUnits}
        />
        
        <button className="btn btn-neutral ml-2" onClick={() => saveToPorftolio()}>
          Save to portfolio
        </button>

      </div>
      

      
    </div>
  );
};
