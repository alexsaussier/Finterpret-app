"use client";
import { useState } from "react";
import AddStockModal from "./AddStockModal";
import { StockTickerSearch } from "./StockTickerSearch";

export const AddToPortfolioSampleComponent = () => {
  const [openModal, setOpenModal] = useState(false);
  const [ticker, setTicker] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [units, setUnits] = useState();

  return (
    <div className="bg-white rounded-lg p-5 shadow-md flex flex-col h-full">
      <h1 className="text-lg md:text-xl font-bold text-left mb-2">
        Add stocks to your portfolio
      </h1>

      <div className="mb-2 flex">
        <StockTickerSearch
          results={results}
          setResults={setResults}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          ticker={ticker}
          setTicker={setTicker}
          units={units}
          setUnits={setUnits}
        />
      </div>
    </div>
  );
};
