"use client";
import { useState } from "react";
import AddStockModal from "./AddStockModal";
import { StockTickerSearch } from "./StockTickerSearch";

export const AddToPortfolioSampleComponent = () => {
  const [openModal, setOpenModal] = useState(false);
  const [ticker, setTicker] = useState();
  const [units, setUnits] = useState();
  const saveToPorftolio = () => {
    //save to mongo
  };
  return (
    <div className="bg-white rounded-lg p-5 shadow-md flex flex-col">
      <h1 className="text-lg md:text-xl font-bold text-left mb-2">
        Update your holdings manually
      </h1>

      <div className="mb-2">
        <StockTickerSearch 
          ticker={ticker}
          setTicker={setTicker}
          units={units}
          setUnits={setUnits}
        />
        
        <button className="btn btn-neutral" onClick={() => saveToPorftolio()}>
          Save to portfolio
        </button>

      </div>
      

      
    </div>
  );
};
