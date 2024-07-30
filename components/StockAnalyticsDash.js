"use client";

import { useEffect, useState } from "react";
import StockCard from "./StockCard";
import ListedStock from "./ListedStock";
import StockAnalyticsCard from "./StockAnalyticsCard";
import getStats from "@/utils/getStats";
import getPrice from "@/utils/getPrice";

//import { getHoldings } from "@/utils/getHoldings";

const StockAnalyticsDash = ({ stocks }) => {
  const [selectedStock, setSelectedStock] = useState(stocks[0]);
  console.log("Selected Stock: " + JSON.stringify(selectedStock, null, 2));

   // Check if stocks is undefined, null, or an empty array
   if (!stocks || stocks.length === 0) {
    return <div className="flex justify-center items-center" style={{ minHeight: "500px" }}>
      Go to Portfolio Analysis and add stocks to your portfolio. 
    </div>;
  }

  return (
    <div className="flex" style={{ minHeight: "500px" }}>
      <div className="w-1/2">
        {stocks.map((stock) => (
          <div className={`mt-4`} key={stock.stockName}>
            <button onClick={() => setSelectedStock(stock)}>
              <ListedStock
                selected={stock.ticker === selectedStock.ticker}
                changePercent={stock.percentChange}
                price={stock.currentPrice}
                name={stock.stockName || stock.ticker}
                units={stock.units}
                currency={stock.currency}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="w-1/2">
      <p> Click on a metric to get some insights 👇</p>
        <StockAnalyticsCard ticker={selectedStock.ticker} stock={selectedStock}/> { /* TODO: PASS THE STOCK ARRAY, SO NO NEED TO FETCH DATA AFTER */ }
      </div>
    </div>
 
  );
};

export default StockAnalyticsDash;
