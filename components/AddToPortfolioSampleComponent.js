"use client";
import { useState } from "react";
import AddStockModal from "./AddStockModal";
import { StockTickerSearch } from "./StockTickerSearch";
import { useSession } from "next-auth/react";

export const AddToPortfolioSampleComponent = () => {
  const [openModal, setOpenModal] = useState(false);
  const [ticker, setTicker] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [units, setUnits] = useState();
  const [stockName, setStockName] = useState("");
  const { data: session } = useSession();
  const user = session?.user;

  console.log("user:", user);
  console.log("hasAccess:", user?.hasAccess);
  console.log("portfolio:", user?.portfolio);

  return (
    <div className="bg-white rounded-lg p-5 shadow-md flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-lg md:text-xl font-bold">
          Add stocks to your portfolio
        </h1>
        {(!user?.hasAccess && user?.portfolio) && (
          <div className="badge badge-neutral badge-outline">
            Free tier: {Math.max(5 - (user?.portfolio?.length || 0), 0)} stocks remaining
          </div>
        )}
        <div className="badge badge-neutral badge-outline">Enter ticker, then quantity</div>
      </div>

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
          stockName={stockName}
          setStockName={setStockName}
        />
      </div>
    </div>
  );
};
