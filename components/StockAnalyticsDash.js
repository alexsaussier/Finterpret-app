"use client";

import { useEffect, useState } from "react";
import StockCard from "./StockCard";
import StockAnalyticsCard from "./StockAnalyticsCard";

const StockAnalyticsDash = ({ stocks }) => {
  //This might not work on first try, because I was still using mock data
  //basically, selectedStock ticker initially should be set to the first of stocks.ticker
  const [selectedStock, setSelectedStock] = useState(stocks[0].ticker);

  //For testing and debugging, this will console log the selected stock on every click
  useEffect(() => {
    console.log("selected stock: " + selectedStock);
  }, [selectedStock]);
  return (
    <div
      className="flex"
      style={{
        minHeight: "500px",
      }}
    >
      <div className="w-1/2">
        {stocks.map((stock, index) => (
          <div
            className={`mt-4`}
            key={stock.stockName}
          >
            <button onClick={() => setSelectedStock(stock.ticker)}>
              <div className={`${
              stock.ticker === selectedStock ? "border border-current rounded-lg" : ""
            }`}>
                <StockCard title={stock.stockName} units={stock.units} />
              </div>
            </button>
          </div>
        ))}
      </div>

      <div className="w-1/2">
        <StockAnalyticsCard ticker={selectedStock} />
      </div>
    </div>
  );
};

export default StockAnalyticsDash;
